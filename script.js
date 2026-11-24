
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

function render() {
  canvas.querySelectorAll(".canvas-object").forEach(el => el.remove());
  layers.innerHTML = "";

  const placeholder = canvas.querySelector(".canvas-placeholder");
  if (placeholder) placeholder.style.display = objects.length ? "none" : "flex";

  objects.forEach(obj => {
    const el = document.createElement("div");
    el.className = "canvas-object" + (selected === obj.id ? " selected" : "");
    el.dataset.id = obj.id;

    el.style.left = obj.x + "px";
    el.style.top = obj.y + "px";
    el.style.width = obj.width + "px";
    el.style.height = obj.height + "px";
    el.style.background = obj.color;
    el.style.borderRadius = obj.radius + "px";
    el.style.color = obj.textColor;
    el.style.zIndex = obj.zIndex;

    if (obj.type === "TextLabel" || obj.type === "TextButton") {
      el.textContent = obj.text;
      el.style.display = "flex";
      el.style.alignItems = "center";
      el.style.justifyContent = "center";
      el.style.fontSize = obj.fontSize + "px";
    }

    if (obj.type === "ImageLabel") {
      el.style.backgroundImage = obj.image ? `url("${obj.image}")` : "none";
      el.style.backgroundSize = "cover";
      el.style.backgroundPosition = "center";
    }

    if (obj.type === "TextButton") {
      el.style.cursor = "pointer";
    }

    if (obj.type === "UICorner" || obj.type === "UIStroke") {
      el.style.display = "none";
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
    image: "",
    zIndex: objects.length + 1
  };

  objects.push(obj);
  selectObject(obj.id);
  saveHistory();
  render();
}

function selectObject(id) {
  selected = id;
  render();
}

function getSelected() {
  return objects.find(o => o.id === selected);
}

function propertyInput(label, key, value, type = "text") {
  return `
    <label class="property">
      ${label}
      <input type="${type}" data-key="${key}" value="${value}">
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
    ${propertyInput("Color", "color", obj.color, "color")}
    ${propertyInput("Texto", "text", obj.text)}
    ${propertyInput("Tamaño de texto", "fontSize", obj.fontSize, "number")}
    ${propertyInput("Esquinas", "radius", obj.radius, "number")}
    ${propertyInput("Imagen URL", "image", obj.image)}
    <button id="deleteObject">Eliminar elemento</button>
  `;

  properties.querySelectorAll("input").forEach(input => {
    input.addEventListener("input", () => {
      const obj = getSelected();
      if (!obj) return;

      const key = input.dataset.key;
      obj[key] = input.type === "number" ? Number(input.value) : input.value;
      render();
      showProperties();
    });
  });

  document.getElementById("deleteObject").onclick = deleteSelected;
}

function deleteSelected() {
  if (!selected) return;
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
    render();
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

function generateLuau() {
  let code = `local ScreenGui = Instance.new("ScreenGui")
ScreenGui.Name = "GeneratedUI"
ScreenGui.ResetOnSpawn = false

`;

  const names = new Map();

  objects.forEach(obj => {
    const variable = "Object" + obj.id;
    names.set(obj.id, variable);

    if (obj.type === "UICorner" || obj.type === "UIStroke") return;

    code += `local ${variable} = Instance.new("${obj.type}")
`;
    code += `${variable}.Name = ${JSON.stringify(obj.name)}
`;
    code += `${variable}.Position = UDim2.fromOffset(${obj.x}, ${obj.y})
`;
    code += `${variable}.Size = UDim2.fromOffset(${obj.width}, ${obj.height})
`;

    if (obj.type === "Frame" || obj.type === "TextButton" || obj.type === "TextLabel") {
      if (obj.color !== "transparent") {
        const hex = obj.color.match(/[0-9a-f]{6}/i);
        if (hex) {
          const n = parseInt(hex[0], 16);
          code += `${variable}.BackgroundColor3 = Color3.fromRGB(${n >> 16}, ${(n >> 8) & 255}, ${n & 255})
`;
        }
      }
    }

    if (obj.type === "TextLabel" || obj.type === "TextButton") {
      code += `${variable}.Text = ${JSON.stringify(obj.text)}
`;
      code += `${variable}.TextColor3 = Color3.fromRGB(255,255,255)
`;
      code += `${variable}.TextSize = ${obj.fontSize}
`;
    }

    if (obj.type === "ImageLabel") {
      code += `${variable}.Image = ${JSON.stringify(obj.image)}
`;
    }

    code += `${variable}.Parent = ScreenGui

`;
  });

  code += `ScreenGui.Parent = game.Players.LocalPlayer:WaitForChild("PlayerGui")`;
  return code;
}

document.getElementById("export").onclick = () => {
  const code = generateLuau();
  const win = window.open("", "_blank");

  if (!win) {
    alert("Permite las ventanas emergentes para ver el código.");
    return;
  }

  win.document.write(`
    <html>
    <head>
    <title>FIGMA - Roblox Export</title>
    <style>
    body{background:#111318;color:white;font-family:monospace;padding:20px}
    textarea{width:100%;height:75vh;background:#202633;color:#8db5ff;padding:15px;border:1px solid #3878ff;border-radius:8px}
    button{padding:12px;background:#3878ff;color:white;border:0;border-radius:7px;margin:8px 0}
    </style>
    </head>
    <body>
    <h2>ROBLOX LUAU EXPORT</h2>
    <button onclick="navigator.clipboard.writeText(document.querySelector('textarea').value)">COPIAR CÓDIGO</button>
    <textarea readonly>${code.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}</textarea>
    </body>
    </html>
  `);
  win.document.close();
};

saveHistory();
render();
