
/* =====================================================
   FIGMA PRO ULTRA 2.0
   Roblox UI Designer
   ===================================================== */

const canvas = document.getElementById("canvas");
const layers = document.getElementById("layers");
const properties = document.getElementById("properties");
const toolbox = document.getElementById("toolbox");

const STORAGE_KEY = "figma_pro_ultra_project";

let objects = [];
let selected = null;
let counter = 0;
let history = [];
let historyIndex = -1;
let activeCategory = "all";
let searchTerm = "";
let zoomLevel = 1;
let showGrid = true;

/* =====================================================
   125 HERRAMIENTAS
   ===================================================== */

const catalog = [];

function addTools(category, entries) {
  entries.forEach(entry => {
    catalog.push({
      name: entry[0],
      icon: entry[1],
      type: entry[2] || "Frame",
      category,
      color: entry[3] || "#29364e",
      text: entry[4] || entry[0]
    });
  });
}

addTools("basic", [
  ["Frame","▣"],["Panel","▤"],["Container","▢"],
  ["Card","▧"],["Window","▣"],["Sidebar","◫"],
  ["Header","▬"],["Footer","▱"],["Section","▤"],
  ["Box","□"],["Container Wide","▭"],["Container Small","▫"],
  ["Profile Card","♙"],["Info Card","ⓘ"],["Notification","♧"],
  ["Modal","▣"],["Popup","▢"],["Tooltip","◈"],
  ["Divider","━"],["Separator","—"]
]);

addTools("text", [
  ["TextLabel","T","TextLabel"],["Title","H","TextLabel"],
  ["Subtitle","h","TextLabel"],["Paragraph","¶","TextLabel"],
  ["Caption","≡","TextLabel"],["Small Text","t","TextLabel"],
  ["Heading 1","H1","TextLabel"],["Heading 2","H2","TextLabel"],
  ["Heading 3","H3","TextLabel"],["Description","≋","TextLabel"],
  ["Username","♙","TextLabel"],["Price Text","$","TextLabel"],
  ["Counter","123","TextLabel"],["Badge Text","✦","TextLabel"],
  ["Status Text","●","TextLabel"]
]);

addTools("buttons", [
  ["TextButton","▣","TextButton","#3878ff","Button"],
  ["Primary Button","◆","TextButton","#3878ff","Continue"],
  ["Secondary Button","◇","TextButton","#39445c","Cancel"],
  ["Danger Button","!","TextButton","#e94e68","Delete"],
  ["Success Button","✓","TextButton","#159e75","Success"],
  ["Icon Button","✦","TextButton","#344c76","★"],
  ["Play Button","▶","TextButton","#2878ee","PLAY"],
  ["Close Button","×","TextButton","#c34458","×"],
  ["Menu Button","☰","TextButton","#344c76","MENU"],
  ["Back Button","←","TextButton","#344c76","BACK"],
  ["Next Button","→","TextButton","#344c76","NEXT"],
  ["Buy Button","$","TextButton","#159e75","BUY"],
  ["Shop Button","🛒","TextButton","#3878ff","SHOP"],
  ["Settings Button","⚙","TextButton","#39445c","SETTINGS"],
  ["Login Button","↪","TextButton","#3878ff","LOGIN"],
  ["Register Button","＋","TextButton","#3878ff","REGISTER"],
  ["Search Button","⌕","TextButton","#39445c","SEARCH"],
  ["Download Button","↓","TextButton","#159e75","DOWNLOAD"],
  ["Upgrade Button","↑","TextButton","#9a65ec","UPGRADE"],
  ["Premium Button","♛","TextButton","#9a65ec","PREMIUM"]
]);

addTools("shapes", [
  ["Rectangle","▰","Frame"],["Square","◼","Frame"],
  ["Circle","●","Frame"],["Rounded Box","▢","Frame"],
  ["Line","━","Frame"],["Outline","▣","Frame"],
  ["Pill","▬","Frame"],["Diamond","◆","Frame"],
  ["Star","★","TextLabel"],["Heart","♥","TextLabel"],
  ["Triangle","▲","TextLabel"],["Arrow","➜","TextLabel"],
  ["Cross","✚","TextLabel"],["Check","✓","TextLabel"],
  ["Ring","◎","TextLabel"],["Dot","●","TextLabel"],
  ["Plus","＋","TextLabel"],["Minus","−","TextLabel"],
  ["Wave","〰","TextLabel"],["Sparkle","✧","TextLabel"]
]);

addTools("media", [
  ["ImageLabel","▧","ImageLabel"],["Image Card","▧","ImageLabel"],
  ["Avatar","♙","ImageLabel"],["Thumbnail","▧","ImageLabel"],
  ["Banner","▰","ImageLabel"],["Cover Image","▱","ImageLabel"],
  ["Game Icon","🎮","ImageLabel"],["Product Image","▧","ImageLabel"],
  ["Gallery Image","▦","ImageLabel"],["Background Image","▧","ImageLabel"]
]);

addTools("roblox", [
  ["Player Card","♙","Frame"],["Player Avatar","◉","ImageLabel"],
  ["Health Bar","♥","Frame"],["Energy Bar","⚡","Frame"],
  ["XP Bar","★","Frame"],["Level Badge","LV","TextLabel"],
  ["Coins Counter","$","TextLabel"],["Gems Counter","◆","TextLabel"],
  ["Inventory Slot","▣","Frame"],["Inventory Panel","▤","Frame"],
  ["Hotbar Slot","▢","Frame"],["Hotbar","▤","Frame"],
  ["Leaderboard","♙","Frame"],["Leaderboard Row","≡","Frame"],
  ["Chat Panel","☏","Frame"],["Chat Message","☷","TextLabel"],
  ["Quest Card","⚑","Frame"],["Quest Button","⚑","TextButton"],
  ["Shop Item","🛒","Frame"],["Shop Panel","▤","Frame"],
  ["Team Badge","⚑","TextLabel"],["Rank Badge","♛","TextLabel"],
  ["Kill Counter","☠","TextLabel"],["Timer","◷","TextLabel"],
  ["Compass","⊕","TextLabel"],["Minimap Panel","◎","Frame"],
  ["Loading Screen","◌","Frame"],["Progress Bar","▰","Frame"],
  ["Game Over Panel","✖","Frame"],["Victory Panel","★","Frame"]
]);

addTools("advanced", [
  ["TextBox","⌨","TextBox"],["Search Field","⌕","TextBox"],
  ["Input Field","▤","TextBox"],["Password Field","●","TextBox"],
  ["ScrollingFrame","▥","ScrollingFrame"],["ViewportFrame","◉","ViewportFrame"],
  ["Progress Track","▰","Frame"],["Slider Track","━","Frame"],
  ["Toggle Switch","◉","TextButton"],["Checkbox","☑","TextButton"],
  ["Radio Button","◉","TextButton"],["Tab Bar","▤","Frame"],
  ["Tab Button","▰","TextButton"],["Dropdown","⌄","TextButton"],
  ["Notification Card","♧","Frame"],["Alert Box","!","Frame"],
  ["Loading Spinner","◌","TextLabel"],["Timer Display","◷","TextLabel"],
  ["Gradient Panel","◈","Frame"],["Shadow Card","▧","Frame"],
  ["Glass Panel","▣","Frame"],["Border Panel","□","Frame"],
  ["List Item","≡","TextButton"],["Menu Item","☰","TextButton"],
  ["Profile Header","♙","Frame"],["Settings Row","⚙","TextButton"],
  ["UICorner","◔","Frame"],["UIStroke","▣","Frame"],
  ["UIGradient","◈","Frame"],["UIListLayout","☷","Frame"],
  ["UIGridLayout","▦","Frame"],["UIPadding","↔","Frame"],
  ["UIScale","↗","Frame"],["Aspect Ratio","▭","Frame"],
  ["Size Constraint","▣","Frame"]
]);

/* =====================================================
   HISTORIAL
   ===================================================== */

function saveHistory() {
  history = history.slice(0, historyIndex + 1);
  history.push(JSON.stringify(objects));
  historyIndex++;
  if (history.length > 60) {
    history.shift();
    historyIndex--;
  }
  scheduleSave();
}

function restoreHistory(index) {
  if (index < 0 || index >= history.length) return;
  historyIndex = index;
  objects = JSON.parse(history[index]);
  selected = null;
  counter = Math.max(0, ...objects.map(o => o.id));
  render();
}

document.getElementById("undo").onclick = () => {
  restoreHistory(historyIndex - 1);
};

document.getElementById("redo").onclick = () => {
  restoreHistory(historyIndex + 1);
};

/* =====================================================
   CAJA DE HERRAMIENTAS
   ===================================================== */

function renderToolbox() {
  toolbox.innerHTML = "";

  const filtered = catalog.filter(item => {
    const categoryMatch =
      activeCategory === "all" || item.category === activeCategory;

    const textMatch =
      (item.name + " " + item.type).toLowerCase().includes(searchTerm);

    return categoryMatch && textMatch;
  });

  filtered.forEach(item => {
    const button = document.createElement("button");
    button.className = "tool-item";
    button.innerHTML = `
      <span class="tool-icon">${item.icon}</span>
      <span>${item.name}</span>
    `;
    button.title = "Añadir " + item.name;
    button.onclick = () => addObject(item);
    toolbox.appendChild(button);
  });

  if (!filtered.length) {
    toolbox.innerHTML = '<p class="muted">No se encontraron elementos.</p>';
  }
}

document.getElementById("toolSearch").addEventListener("input", e => {
  searchTerm = e.target.value.toLowerCase().trim();
  renderToolbox();
});

document.querySelectorAll(".category").forEach(button => {
  button.onclick = () => {
    document.querySelectorAll(".category").forEach(b => b.classList.remove("active"));
    button.classList.add("active");
    activeCategory = button.dataset.category;
    renderToolbox();
  };
});

/* =====================================================
   OBJETOS
   ===================================================== */

function addObject(item) {
  counter++;

  const isText = ["TextLabel", "TextButton", "TextBox"].includes(item.type);

  const obj = {
    id: counter,
    name: item.name + counter,
    type: item.type,
    category: item.category,
    x: 25 + (objects.length * 13) % 130,
    y: 25 + (objects.length * 17) % 180,
    width: item.name.includes("Bar") ? 180 : 130,
    height: item.name.includes("Bar") ? 18 : 48,
    color: item.color || (isText ? "transparent" : "#29364e"),
    textColor: "#ffffff",
    text: item.text || item.name,
    fontSize: 16,
    radius: 8,
    stroke: 0,
    strokeColor: "#ffffff",
    transparency: 0,
    textTransparency: 0,
    image: "",
    visible: true,
    zIndex: objects.length + 1
  };

  if (item.name === "Circle" || item.name === "Dot") {
    obj.radius = 100;
    obj.width = 60;
    obj.height = 60;
  }

  if (item.name.includes("Bar")) {
    obj.height = 18;
  }

  if (item.name.includes("Banner")) {
    obj.width = 300;
    obj.height = 90;
  }

  if (item.name.includes("Panel") || item.name.includes("Window")) {
    obj.width = 240;
    obj.height = 180;
  }

  objects.push(obj);
  selected = obj.id;
  saveHistory();
  render();
}

/* =====================================================
   LIENZO
   ===================================================== */

function render() {
  canvas.querySelectorAll(".canvas-object").forEach(e => e.remove());
  layers.innerHTML = "";

  const placeholder = canvas.querySelector(".canvas-placeholder");
  if (placeholder) {
    placeholder.style.display = objects.length ? "none" : "flex";
  }

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
      opacity: 1 - (obj.transparency || 0),
      border: obj.stroke ? `${obj.stroke}px solid ${obj.strokeColor}` : "none",
      boxSizing: "border-box",
      display: obj.visible ? "flex" : "none",
      alignItems: "center",
      justifyContent: "center",
      fontSize: obj.fontSize + "px",
      overflow: "hidden"
    });

    if (["TextLabel", "TextButton", "TextBox"].includes(obj.type)) {
      el.textContent = obj.text;
    }

    if (obj.type === "ImageLabel") {
      el.style.backgroundImage = obj.image ? `url("${obj.image}")` : "none";
      el.style.backgroundSize = "cover";
      el.style.backgroundPosition = "center";
    }

    el.addEventListener("pointerdown", e => {
      if (activeTool === "hand" || previewMode) return;
      e.stopPropagation();
      selectObject(obj.id);
      startDrag(e, obj);
    });

    el.addEventListener("dblclick", () => {
      const input = properties.querySelector('[data-key="text"]');
      if (input) { input.focus(); input.select(); }
    });

    canvas.appendChild(el);

    if (selected === obj.id && !previewMode) {
      ["nw", "ne", "sw", "se"].forEach(dir => {
        const handle = document.createElement("span");
        handle.className = "handle " + dir;
        handle.addEventListener("pointerdown", ev => {
          ev.stopPropagation();
          startResize(ev, obj, dir);
        });
        el.appendChild(handle);
      });
    }

    const row = document.createElement("div");
    row.className = "layer" + (selected === obj.id ? " active" : "") + (obj.visible ? "" : " hidden-layer");
    const nameBtn = document.createElement("button");
    nameBtn.className = "layer-name";
    nameBtn.textContent = obj.name;
    nameBtn.onclick = () => selectObject(obj.id);
    const eye = document.createElement("button");
    eye.textContent = obj.visible ? "◉" : "○";
    eye.setAttribute("aria-label", obj.visible ? "Ocultar capa" : "Mostrar capa");
    eye.onclick = () => { obj.visible = !obj.visible; saveHistory(); render(); };
    row.append(nameBtn, eye);
    layers.prepend(row);
  });

  const count = document.getElementById("objectCount");
  if (count) count.textContent = objects.length + " elementos";

  if (selected !== null && getSelected()) {
    showProperties();
  } else {
    selected = null;
    properties.innerHTML = `
      <div class="empty-inspector">
        <div class="empty-icon">◈</div>
        <h3>Ningún elemento seleccionado</h3>
        <p>Selecciona un objeto del lienzo para modificar sus propiedades.</p>
      </div>`;
  }
}

function selectObject(id) {
  if (selected === id) return;
  selected = id;
  render();
}

function getSelected() {
  return objects.find(o => o.id === selected);
}

canvas.addEventListener("click", e => {
  if (e.target === canvas || e.target.classList.contains("canvas-placeholder")) {
    selected = null;
    render();
  }
});

/* =====================================================
   ARRASTRAR ELEMENTOS
   ===================================================== */

function startDrag(e, obj) {
  if (e.button !== undefined && e.button !== 0) return;

  const startX = e.clientX;
  const startY = e.clientY;
  const initialX = obj.x;
  const initialY = obj.y;
  let moved = false;

  const move = ev => {
    moved = true;
    obj.x = Math.max(0, initialX + (ev.clientX - startX) / zoomLevel);
    obj.y = Math.max(0, initialY + (ev.clientY - startY) / zoomLevel);

    const el = canvas.querySelector(`[data-id="${obj.id}"]`);
    if (el) {
      el.style.left = obj.x + "px";
      el.style.top = obj.y + "px";
    }
  };

  const up = () => {
    window.removeEventListener("pointermove", move);
    window.removeEventListener("pointerup", up);
    if (moved) {
      saveHistory();
      render();
    }
  };

  window.addEventListener("pointermove", move);
  window.addEventListener("pointerup", up);
}

/* =====================================================
   INSPECTOR
   ===================================================== */

function propertyInput(label, key, value, type = "text") {
  const safe = String(value ?? "").replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;").replace(/</g, "&lt;");

  return `
    <label class="property">
      ${label}
      <input type="${type}" ${type === "number" ? 'step="any"' : ""} data-key="${key}" value="${safe}">
    </label>`;
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
    ${propertyInput("Color de fondo", "color",
      obj.color === "transparent" ? "#202633" : obj.color, "color")}
    ${propertyInput("Texto", "text", obj.text)}
    ${propertyInput("Color de texto", "textColor", obj.textColor, "color")}
    ${propertyInput("Tamaño del texto", "fontSize", obj.fontSize, "number")}
    ${propertyInput("Esquinas", "radius", obj.radius, "number")}
    ${propertyInput("Grosor del borde", "stroke", obj.stroke, "number")}
    ${propertyInput("Color del borde", "strokeColor", obj.strokeColor, "color")}
    ${propertyInput("Transparencia (0–1)", "transparency", obj.transparency, "number")}
    ${propertyInput("URL de imagen", "image", obj.image)}
    <label class="property">
      <span>Visibilidad</span>
      <input type="checkbox" data-key="visible" ${obj.visible ? "checked" : ""}>
    </label>
  `;

  properties.querySelectorAll("input").forEach(input => {
    input.addEventListener("change", () => {
      const current = getSelected();
      if (!current) return;

      const key = input.dataset.key;

      if (key === "visible") {
        current.visible = input.checked;
      } else if (["x", "y", "width", "height", "fontSize",
        "radius", "stroke", "transparency"].includes(key)) {
        const n = Number(input.value);
        current[key] = key === "transparency" ? Math.min(1, Math.max(0, n)) : n;
      } else {
        current[key] = input.value;
      }

      saveHistory();
      render();
    });
  });
}

/* =====================================================
   DUPLICAR Y ELIMINAR
   ===================================================== */

function duplicateSelected() {
  const obj = getSelected();
  if (!obj) return;

  counter++;
  const copy = JSON.parse(JSON.stringify(obj));
  copy.id = counter;
  copy.name += "_Copy";
  copy.x += 20;
  copy.y += 20;
  copy.zIndex += 1;

  objects.push(copy);
  selected = copy.id;
  saveHistory();
  render();
}

function deleteSelected() {
  if (selected === null) return;
  objects = objects.filter(o => o.id !== selected);
  selected = null;
  saveHistory();
  render();
}

document.getElementById("duplicateObject").onclick = duplicateSelected;
document.getElementById("deleteObject").onclick = deleteSelected;

/* =====================================================
   PESTAÑAS
   ===================================================== */

document.querySelectorAll(".tab").forEach(tab => {
  tab.onclick = () => {
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    tab.classList.add("active");

    const assets = document.getElementById("assetsPanel");
    const layerPanel = document.getElementById("layersPanel");

    assets.hidden = tab.dataset.panel !== "assets";
    layerPanel.hidden = tab.dataset.panel !== "layers";
  };
});

document.getElementById("addLayer").onclick = () => {
  addObject({
    name: "Frame",
    icon: "▣",
    type: "Frame",
    category: "basic"
  });
};

/* =====================================================
   ZOOM Y CUADRÍCULA
   ===================================================== */

function updateZoom() {
  canvas.style.transform = `scale(${zoomLevel})`;
  document.getElementById("zoom").textContent =
    Math.round(zoomLevel * 100) + "%";
  canvas.style.margin = `${(zoomLevel - 1) * 325}px ${(zoomLevel - 1) * 195}px`;
}

document.getElementById("zoomIn").onclick = () => {
  zoomLevel = Math.min(2, zoomLevel + 0.1);
  updateZoom();
};

document.getElementById("zoomOut").onclick = () => {
  zoomLevel = Math.max(0.4, zoomLevel - 0.1);
  updateZoom();
};

document.getElementById("fitCanvas").onclick = () => {
  const area = document.getElementById("canvasArea");
  const fit = Math.min(1.5, (area.clientHeight - 70) / 650, (area.clientWidth - 70) / 390);
  zoomLevel = Math.max(0.4, Math.round(fit * 10) / 10);
  updateZoom();
};

document.getElementById("gridToggle").onclick = () => {
  showGrid = !showGrid;
  document.getElementById("canvasArea").style.backgroundImage =
    showGrid ? "" : "none";
};

let activeTool = "select";
let previewMode = false;

function setTool(tool) {
  activeTool = tool;
  const ids = { select: "selectTool", move: "moveTool", hand: "handTool" };
  Object.entries(ids).forEach(([name, id]) =>
    document.getElementById(id).classList.toggle("tool-active", name === tool));
  document.getElementById("canvasArea").style.cursor = tool === "hand" ? "grab" : "";
}

document.getElementById("selectTool").onclick = () => setTool("select");
document.getElementById("moveTool").onclick = () => setTool("move");
document.getElementById("handTool").onclick = () => setTool("hand");

/* =====================================================
   GUARDAR Y RECUPERAR PROYECTO
   ===================================================== */

function saveProject(silent) {
  const data = {
    name: document.getElementById("projectName").value,
    objects,
    counter
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    document.getElementById("saveStatus").textContent = "● Guardado";
    if (!silent) toast("Proyecto guardado en este dispositivo");
  } catch (error) {
    toast("No se pudo guardar el proyecto");
  }
}

function loadProject() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return false;

    const data = JSON.parse(saved);
    objects = Array.isArray(data.objects) ? data.objects : [];
    counter = Math.max(data.counter || 0, ...objects.map(o => o.id));
    document.getElementById("projectName").value = data.name || "Mi proyecto";
    return true;
  } catch (error) {
    return false;
  }
}

document.getElementById("saveProject").onclick = () => saveProject();

document.getElementById("projectName").addEventListener("input", e => {
  document.getElementById("canvasProjectName").textContent = e.target.value;
  scheduleSave();
});

/* =====================================================
   NOTIFICACIONES
   ===================================================== */

function toast(message) {
  const container = document.getElementById("toastContainer");
  const item = document.createElement("div");
  item.className = "toast";
  item.textContent = message;
  container.appendChild(item);

  setTimeout(() => item.remove(), 2800);
}

/* =====================================================
   GENERADOR LUAU PARA ROBLOX
   ===================================================== */

function luaString(value) {
  return JSON.stringify(String(value ?? ""));
}

function luaColor(hex) {
  const match = String(hex).match(/^#?([0-9a-f]{6})$/i);
  if (!match) return "Color3.fromRGB(32,38,51)";

  const n = parseInt(match[1], 16);
  return `Color3.fromRGB(${n >> 16}, ${(n >> 8) & 255}, ${n & 255})`;
}

function generateLuau() {
  let code = `-- FIGMA PRO ULTRA
-- Roblox LocalScript Export
-- Colocar en StarterPlayerScripts

local Players = game:GetService("Players")
local player = Players.LocalPlayer
local playerGui = player:WaitForChild("PlayerGui")

local ScreenGui = Instance.new("ScreenGui")
ScreenGui.Name = "FIGMA_PRO_INTERFACE"
ScreenGui.ResetOnSpawn = false
ScreenGui.IgnoreGuiInset = false
ScreenGui.Parent = playerGui

`;

  objects.forEach(obj => {
    const variable = "Object" + obj.id;

    let className = obj.type;

    const allowed = [
      "Frame", "TextLabel", "TextButton",
      "TextBox", "ImageLabel", "ScrollingFrame",
      "ViewportFrame"
    ];

    if (!allowed.includes(className)) {
      className = "Frame";
    }

    code += `
-- ${obj.name}
local ${variable} = Instance.new("${className}")
${variable}.Name = ${luaString(obj.name)}
${variable}.Position = UDim2.fromOffset(${Math.round(obj.x)}, ${Math.round(obj.y)})
${variable}.Size = UDim2.fromOffset(${Math.round(obj.width)}, ${Math.round(obj.height)})
${variable}.BackgroundColor3 = ${luaColor(obj.color)}
${variable}.BackgroundTransparency = ${obj.color === "transparent" ? 1 : Math.min(1, Math.max(0, obj.transparency || 0))}
${variable}.BorderSizePixel = 0
${variable}.Visible = ${obj.visible ? "true" : "false"}
${variable}.ZIndex = ${Math.max(1, Math.round(obj.zIndex))}
`;

    if (["TextLabel", "TextButton", "TextBox"].includes(className)) {
      code += `
${variable}.Text = ${luaString(obj.text)}
${variable}.TextColor3 = ${luaColor(obj.textColor)}
${variable}.TextSize = ${Math.max(1, Math.round(obj.fontSize))}
${variable}.TextWrapped = true
${variable}.Font = Enum.Font.Gotham
${variable}.TextTransparency = ${Math.min(1, Math.max(0, obj.textTransparency || 0))}
`;
    }

    if (className === "TextBox") {
      code += `
${variable}.ClearTextOnFocus = false
${variable}.PlaceholderText = "Escribe aquí..."
`;
    }

    if (className === "ImageLabel") {
      code += `
${variable}.Image = ${luaString(obj.image)}
${variable}.ScaleType = Enum.ScaleType.Crop
`;
    }

    if (className === "ScrollingFrame") {
      code += `
${variable}.CanvasSize = UDim2.new(0, 0, 2, 0)
${variable}.ScrollBarThickness = 5
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
print("FIGMA PRO: Interfaz creada correctamente")
`;

  return code;
}

/* =====================================================
   EXPORTACIÓN
   ===================================================== */

const exportModal = document.getElementById("exportModal");
const modalContent = exportModal.querySelector(".modal-content");

document.getElementById("export").onclick = () => {
  if (!objects.length) return toast("Añade un elemento antes de exportar");
  modalContent.innerHTML = `
    <button id="closeExport" class="modal-close" aria-label="Cerrar">×</button>
    <div class="modal-icon">↗</div>
    <h2>Exportar diseño</h2>
    <p>Elige cómo quieres exportar tu interfaz.</p>
    <div class="export-options">
      <button id="exportLocalScript">
        <strong>LocalScript</strong>
        <span>Para Roblox Studio Lite</span>
      </button>
      <button id="exportCode">
        <strong>Código Luau</strong>
        <span>Copiar código generado</span>
      </button>
      <button id="exportJSON">
        <strong>Proyecto JSON</strong>
        <span>Descargar diseño editable</span>
      </button>
    </div>
  `;

  exportModal.hidden = false;
  document.getElementById("closeExport").onclick = closeExport;
  document.getElementById("exportLocalScript").onclick = downloadLua;
  document.getElementById("exportCode").onclick = showGeneratedCode;
  document.getElementById("exportJSON").onclick = downloadJSON;
};

function closeExport() {
  exportModal.hidden = true;
}

document.getElementById("closeExport").onclick = closeExport;

function showGeneratedCode() {
  const code = generateLuau();

  modalContent.innerHTML = `
    <button id="closeExport" class="modal-close" aria-label="Cerrar">×</button>
    <h2>Tu código Luau</h2>
    <p>Copia este código y pégalo en un LocalScript de Studio Lite.</p>
    <textarea id="generatedCode" style="
      width:100%;height:260px;margin-top:15px;
      background:#080e1b;color:#9fc6ff;
      border:1px solid #39547c;border-radius:8px;
      padding:12px;font-family:monospace;
    "></textarea>
    <button id="copyGenerated" class="primary-btn"
      style="padding:12px;width:100%;margin-top:10px">
      COPIAR CÓDIGO
    </button>
  `;

  document.getElementById("generatedCode").value = code;
  document.getElementById("closeExport").onclick = closeExport;

  document.getElementById("copyGenerated").onclick = async () => {
    try {
      await navigator.clipboard.writeText(code);
      toast("Código copiado");
    } catch (error) {
      const area = document.getElementById("generatedCode");
      area.select();
      toast("Selecciona el código y pulsa Copiar");
    }
  };
}

function downloadJSON() {
  const data = {
    name: document.getElementById("projectName").value,
    objects,
    counter
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json"
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "figma-project.json";
  link.click();
  URL.revokeObjectURL(url);
  toast("Proyecto JSON exportado");
}

/* =====================================================
   VISTA PREVIA
   ===================================================== */

document.getElementById("preview").onclick = () => togglePreview();

/* =====================================================
   INICIO
   ===================================================== */


/* =====================================================
   MEJORAS: autoguardado, redimensionar, atajos, vista previa
   ===================================================== */

let saveTimer;
function scheduleSave() {
  document.getElementById("saveStatus").textContent = "● Sin guardar";
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => saveProject(true), 800);
}

function startResize(e, obj, dir) {
  const sx = e.clientX, sy = e.clientY;
  const o = { x: obj.x, y: obj.y, w: obj.width, h: obj.height };

  const move = ev => {
    const dx = (ev.clientX - sx) / zoomLevel;
    const dy = (ev.clientY - sy) / zoomLevel;
    if (dir.includes("e")) obj.width = Math.max(10, Math.round(o.w + dx));
    if (dir.includes("s")) obj.height = Math.max(10, Math.round(o.h + dy));
    if (dir.includes("w")) {
      obj.width = Math.max(10, Math.round(o.w - dx));
      obj.x = Math.round(o.x + o.w - obj.width);
    }
    if (dir.includes("n")) {
      obj.height = Math.max(10, Math.round(o.h - dy));
      obj.y = Math.round(o.y + o.h - obj.height);
    }
    const el = canvas.querySelector(`[data-id="${obj.id}"]`);
    if (el) Object.assign(el.style, {
      left: obj.x + "px", top: obj.y + "px",
      width: obj.width + "px", height: obj.height + "px"
    });
  };

  const up = () => {
    window.removeEventListener("pointermove", move);
    window.removeEventListener("pointerup", up);
    saveHistory();
    render();
  };

  window.addEventListener("pointermove", move);
  window.addEventListener("pointerup", up);
}

/* Mano: arrastrar el lienzo */
const canvasArea = document.getElementById("canvasArea");
canvasArea.addEventListener("pointerdown", e => {
  if (activeTool !== "hand") return;
  const sx = e.clientX, sy = e.clientY;
  const left = canvasArea.scrollLeft, top = canvasArea.scrollTop;
  const move = ev => {
    canvasArea.scrollLeft = left - (ev.clientX - sx);
    canvasArea.scrollTop = top - (ev.clientY - sy);
  };
  const up = () => {
    window.removeEventListener("pointermove", move);
    window.removeEventListener("pointerup", up);
  };
  window.addEventListener("pointermove", move);
  window.addEventListener("pointerup", up);
});

/* Zoom con Ctrl/Cmd + rueda */
canvasArea.addEventListener("wheel", e => {
  if (!(e.ctrlKey || e.metaKey)) return;
  e.preventDefault();
  zoomLevel = Math.min(2, Math.max(0.4, zoomLevel - Math.sign(e.deltaY) * 0.1));
  updateZoom();
}, { passive: false });

/* Vista previa */
function togglePreview() {
  previewMode = !previewMode;
  selected = null;
  document.querySelector(".app-shell").classList.toggle("preview-mode", previewMode);
  document.getElementById("preview").textContent = previewMode ? "✕ Salir" : "▶ Vista previa";
  render();
}

/* Exportar .lua */
function downloadLua() {
  const blob = new Blob([generateLuau()], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const name = (document.getElementById("projectName").value || "interfaz").replace(/[^\w-]+/g, "_");
  link.href = url;
  link.download = name + ".lua";
  link.click();
  URL.revokeObjectURL(url);
  toast("LocalScript descargado");
}

exportModal.addEventListener("click", e => {
  if (e.target === exportModal) closeExport();
});

/* Atajos de teclado */
document.addEventListener("keydown", e => {
  if (["INPUT", "TEXTAREA"].includes(e.target.tagName)) return;
  const mod = e.ctrlKey || e.metaKey;
  const key = e.key.toLowerCase();
  const obj = getSelected();

  if (mod && key === "z") { e.preventDefault(); restoreHistory(historyIndex + (e.shiftKey ? 1 : -1)); }
  else if (mod && key === "y") { e.preventDefault(); restoreHistory(historyIndex + 1); }
  else if (mod && key === "d") { e.preventDefault(); duplicateSelected(); }
  else if (mod && key === "s") { e.preventDefault(); saveProject(); }
  else if (key === "delete" || key === "backspace") { e.preventDefault(); deleteSelected(); }
  else if (key === "escape") {
    closeExport();
    if (previewMode) togglePreview();
    else { selected = null; render(); }
  }
  else if (obj && key.startsWith("arrow")) {
    e.preventDefault();
    const step = e.shiftKey ? 10 : 1;
    if (key === "arrowleft") obj.x = Math.max(0, obj.x - step);
    if (key === "arrowright") obj.x += step;
    if (key === "arrowup") obj.y = Math.max(0, obj.y - step);
    if (key === "arrowdown") obj.y += step;
    saveHistory();
    render();
  }
});

renderToolbox();

if (loadProject()) {
  saveHistory();
} else {
  saveHistory();
}

document.getElementById("canvasProjectName").textContent =
  document.getElementById("projectName").value;

render();
updateZoom();

console.log("FIGMA PRO ULTRA iniciado. Herramientas:", catalog.length);
