
const canvas = document.getElementById("canvas");
const layers = document.getElementById("layers");
const properties = document.getElementById("properties");

let objects = [];
let selected = null;
let counter = 0;
let history = [];
let historyIndex = -1;

function saveHistory() {
  history = history.slice(0, historyIndex + 1);
  history.push(JSON.stringify(objects));
  historyIndex++;
}

function getSelected() {
  return objects.find(o => o.id === selected);
}

function render() {
  canvas.querySelectorAll(".canvas-object").forEach(e => e.remove());
  layers.innerHTML = "";

  const placeholder = canvas.querySelector(".canvas-placeholder");
  if (placeholder) placeholder.style.display = objects.length ? "none" : "flex";

  objects.forEach(obj => {
    const el = document.createElement("div");
    el.className = "canvas-object" + (selected === obj.id ? " selected" : "");
    el.dataset.id = obj.id;

    Object.assign(el.style, {
      left: obj.x + "px",
      top: obj.y + "px",
      width: obj.width + "px",
      height: obj.height + "px",
      background: obj.color,
      borderRadius: obj.radius + "px",
      color: obj.textColor,
      zIndex: obj.zIndex,
      boxSizing: "border-box",
      border: obj.stroke ? `${obj.stroke}px solid ${obj.strokeColor}` : "none"
    });

    if (obj.type === "TextLabel" || obj.type === "TextButton") {
      el.textContent = obj.text;
      Object.assign(el.style, {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: obj.fontSize + "px"
      });
    }

    if (obj.type === "ImageLabel") {
      el.style.backgroundImage = obj.image ? `url("${obj.image}")` : "none";
      el.style.backgroundSize = "cover";
      el.style.backgroundPosition = "center";
    }

    el.addEventListener("pointerdown", e => {
      e.stopPropagation();
      selectObject(obj.id);
      startDrag(e, obj);
    });

    canvas.appendChild(el);

    const layer = document.createElement("div");
    layer.className = "layer" + (selected === obj.id ? " active" : "");
    layer.textContent = obj.name;
    layer.onclick = () => selectObject(obj.id);
    layers.appendChild(layer);
  });

  if (selected) showProperties();
  else properties.innerHTML = '<p class="muted">Selecciona un elemento.</p>';
}

function addObject(type) {
  counter++;

  const obj = {
    id: counter,
    name: type + counter,
    type,
    x: 25 + (objects.length * 12) % 120,
    y: 25 + (objects.length * 12) % 180,
    width: type === "Frame" ? 180 : 130,
    height: type === "Frame" ? 140 : 45,
    color: type === "TextLabel" ? "transparent" :
      type === "TextButton" ? "#3878ff" : "#29364e",
    textColor: "#ffffff",
    text: type === "TextButton" ? "Button" : "Text",
    fontSize: 16,
    radius: 8,
    stroke: 0,
    strokeColor: "#ffffff",
    image: "",
    zIndex: objects.length + 1
  };

  objects.push(obj);
  selected = obj.id;
  saveHistory();
  render();
}

function selectObject(id) {
  selected = id;
  render();
}

function propertyInput(label, key, value, type = "text") {
  const safeValue = String(value ?? "").replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;").replace(/</g, "&lt;");

  return `
    <label class="property">
      ${label}
      <input type="${type}" data-key="${key}" value="${safeValue}">
    </label>
  `;
}

function showProperties() {
  const obj = getSelected();
  if (!obj) return;

  properties.innerHTML = `
    <h3>${obj.type}</h3>
    ${propertyInput("Nombre", "name", obj.name)}
    ${propertyInput("Posición X", "x", obj.x, "number")}
    ${propertyInput("Posición Y", "y", obj.y, "number")}
    ${propertyInput("Ancho", "width", obj.width, "number")}
    ${propertyInput("Alto", "height", obj.height, "number")}
    ${propertyInput("Color", "color", obj.color === "transparent" ? "#202633" : obj.color, "color")}
    ${propertyInput("Texto", "text", obj.text)}
    ${propertyInput("Color del texto", "textColor", obj.textColor, "color")}
    ${propertyInput("Tamaño del texto", "fontSize", obj.fontSize, "number")}
    ${propertyInput("Esquinas", "radius", obj.radius, "number")}
    ${propertyInput("Grosor del borde", "stroke", obj.stroke, "number")}
    ${propertyInput("Color del borde", "strokeColor", obj.strokeColor, "color")}
    ${propertyInput("Imagen URL", "image", obj.image)}
    <button id="deleteObject">Eliminar elemento</button>
  `;

  properties.querySelectorAll("input").forEach(input => {
    input.addEventListener("change", () => {
      const current = getSelected();
      if (!current) return;

      const key = input.dataset.key;
      current[key] = ["x", "y", "width", "height", "fontSize", "radius", "stroke"]
        .includes(key) ? Number(input.value) : input.value;

      saveHistory();
      render();
    });
  });

  document.getElementById("deleteObject").onclick = deleteSelected;
}

function deleteSelected() {
  if (selected === null) return;
  objects = objects.filter(o => o.id !== selected);
  selected = null;
  saveHistory();
  render();
}

function startDrag(e, obj) {
  if (e.button !== undefined && e.button !== 0) return;

  const startX = e.clientX;
  const startY = e.clientY;
  const initialX = obj.x;
  const initialY = obj.y;
  const scaleX = canvas.clientWidth / 390;
  const scaleY = canvas.clientHeight / 650;

  const move = ev => {
    obj.x = Math.max(0, initialX + (ev.clientX - startX) / scaleX);
    obj.y = Math.max(0, initialY + (ev.clientY - startY) / scaleY);
    const el = canvas.querySelector(`[data-id="${obj.id}"]`);
    if (el) {
      el.style.left = obj.x + "px";
      el.style.top = obj.y + "px";
    }
  };

  const up = () => {
    window.removeEventListener("pointermove", move);
    window.removeEventListener("pointerup", up);
    saveHistory();
  };

  window.addEventListener("pointermove", move);
  window.addEventListener("pointerup", up);
}

document.querySelectorAll(".add").forEach(button => {
  button.addEventListener("click", () => addObject(button.dataset.type));
});

canvas.addEventListener("click", e => {
  if (e.target === canvas || e.target.classList.contains("canvas-placeholder")) {
    selected = null;
    render();
  }
});

document.getElementById("undo").onclick = () => {
  if (historyIndex <= 0) return;
  historyIndex--;
  objects = JSON.parse(history[historyIndex]);
  selected = null;
  render();
};

document.getElementById("redo").onclick = () => {
  if (historyIndex >= history.length - 1) return;
  historyIndex++;
  objects = JSON.parse(history[historyIndex]);
  selected = null;
  render();
};

function luaString(value) {
  return JSON.stringify(String(value ?? ""));
}

function luaColor(hex) {
  const match = String(hex).match(/^#?([0-9a-f]{6})$/i);
  if (!match) return "Color3.fromRGB(32, 38, 51)";

  const n = parseInt(match[1], 16);
  return `Color3.fromRGB(${n >> 16}, ${(n >> 8) & 255}, ${n & 255})`;
}

function generateLuau() {
  let code = `-- FIGMA - Roblox UI Export
-- Pega este código en un LocalScript.
-- Compatible con Roblox Studio Lite.

local Players = game:GetService("Players")
local player = Players.LocalPlayer
local playerGui = player:WaitForChild("PlayerGui")

local ScreenGui = Instance.new("ScreenGui")
ScreenGui.Name = "FIGMA_GeneratedUI"
ScreenGui.ResetOnSpawn = false
ScreenGui.IgnoreGuiInset = false
ScreenGui.Parent = playerGui

`;

  objects.forEach((obj, index) => {
    const variable = "UIObject" + obj.id;

    let className = obj.type;
    if (className === "Frame") className = "Frame";
    if (className === "TextLabel") className = "TextLabel";
    if (className === "TextButton") className = "TextButton";
    if (className === "ImageLabel") className = "ImageLabel";

    if (!["Frame", "TextLabel", "TextButton", "ImageLabel"].includes(className)) {
      return;
    }

    code += `
-- ${obj.name}
local ${variable} = Instance.new("${className}")
${variable}.Name = ${luaString(obj.name)}
${variable}.Position = UDim2.fromOffset(${Math.round(obj.x)}, ${Math.round(obj.y)})
${variable}.Size = UDim2.fromOffset(${Math.round(obj.width)}, ${Math.round(obj.height)})
${variable}.BackgroundColor3 = ${luaColor(obj.color)}
${variable}.BackgroundTransparency = ${obj.color === "transparent" ? 1 : 0}
${variable}.ZIndex = ${Math.max(1, Math.round(obj.zIndex))}
`;

    if (className === "TextLabel" || className === "TextButton") {
      code += `
${variable}.Text = ${luaString(obj.text)}
${variable}.TextColor3 = ${luaColor(obj.textColor)}
${variable}.TextSize = ${Math.max(1, Math.round(obj.fontSize))}
${variable}.TextWrapped = true
${variable}.Font = Enum.Font.Gotham
`;
    }

    if (className === "ImageLabel") {
      code += `
${variable}.Image = ${luaString(obj.image)}
${variable}.ScaleType = Enum.ScaleType.Crop
`;
    }

    code += `
${variable}.Parent = ScreenGui
`;

    if (obj.radius > 0) {
      code += `
local Corner${obj.id} = Instance.new("UICorner")
Corner${obj.id}.CornerRadius = UDim.new(0, ${Math.round(obj.radius)})
Corner${obj.id}.Parent = ${variable}
`;
    }

    if (obj.stroke > 0) {
      code += `
local Stroke${obj.id} = Instance.new("UIStroke")
Stroke${obj.id}.Thickness = ${Math.round(obj.stroke)}
Stroke${obj.id}.Color = ${luaColor(obj.strokeColor)}
Stroke${obj.id}.Parent = ${variable}
`;
    }
  });

  code += `
print("FIGMA: GUI creada correctamente")
`;

  return code;
}

function exportCode() {
  const code = generateLuau();

  const win = window.open("", "_blank");

  if (!win) {
    alert("Permite las ventanas emergentes para exportar.");
    return;
  }

  const escaped = code.replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  win.document.write(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>FIGMA - Exportar Roblox</title>
      <style>
        body {
          background: #111318;
          color: white;
          font-family: Arial, sans-serif;
          padding: 18px;
        }
        textarea {
          width: 100%;
          height: 70vh;
          box-sizing: border-box;
          background: #202633;
          color: #9fc1ff;
          padding: 12px;
          border: 1px solid #3878ff;
          border-radius: 8px;
          font-family: monospace;
        }
        button {
          padding: 12px 18px;
          background: #3878ff;
          color: white;
          border: 0;
          border-radius: 8px;
          margin: 10px 0;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <h2>FIGMA — ROBLOX LOCAL SCRIPT</h2>
      <p>Copia el código y pégalo en un LocalScript de Studio Lite.</p>
      <button id="copy">COPIAR CÓDIGO</button>
      <textarea id="code" readonly>${escaped}</textarea>
      <script>
        document.getElementById("copy").onclick = async () => {
          const area = document.getElementById("code");
          try {
            await navigator.clipboard.writeText(area.value);
            alert("Código copiado");
          } catch (e) {
            area.select();
            document.execCommand("copy");
            alert("Selecciona y copia el código si no se copió.");
          }
        };
      <\/script>
    </body>
    </html>
  `);

  win.document.close();
}

document.getElementById("export").onclick = exportCode;

saveHistory();
render();
