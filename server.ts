import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { createServer } from "http";
import { WebSocketServer, WebSocket } from "ws";

async function startServer() {
  const app = express();
  const server = createServer(app);
  const PORT = 3000;

  // Initial State
  let devices = [
    { id: '1', name: 'Main Inverter', type: 'Inverter', status: 'online', power: 4.2, voltage: 234, temp: 42, assignedTo: '1' },
    { id: '2', name: 'South Array', type: 'Sensor', status: 'online', power: 2.8, voltage: 110, temp: 38, assignedTo: '1' },
    { id: '3', name: 'North Array', type: 'Sensor', status: 'online', power: 1.4, voltage: 110, temp: 36, assignedTo: '1' },
    { id: '4', name: 'Battery Bank A', type: 'Battery', status: 'online', power: -0.5, voltage: 48, temp: 28, assignedTo: '1' },
    { id: '5', name: 'EV Station 1', type: 'Meter', status: 'offline', power: 0.0, voltage: 0, temp: 22, assignedTo: '2' },
    { id: '6', name: 'HVAC Controller', type: 'Meter', status: 'warning', power: 0.8, voltage: 230, temp: 45, assignedTo: '2' },
  ];

  let users = [
    { id: '1', name: 'Pranjal Gupta', email: 'pr.gupta2003@gmail.com', role: 'admin' },
    { id: '2', name: 'John Doe', email: 'john@example.com', role: 'user' },
  ];

  // WebSocket Server
  const wss = new WebSocketServer({ server });

  wss.on('connection', (ws) => {
    console.log('Client connected to WebSocket');
    ws.send(JSON.stringify({ type: 'INITIAL_STATE', devices }));
  });

  // Broadcast updates every 3 seconds
  setInterval(() => {
    devices = devices.map(d => {
      const powerChange = (Math.random() - 0.5) * 0.2;
      const tempChange = (Math.random() - 0.5) * 1;
      let newStatus = d.status;
      if (Math.random() > 0.95) {
        const statuses: ('online' | 'offline' | 'warning')[] = ['online', 'offline', 'warning'];
        newStatus = statuses[Math.floor(Math.random() * statuses.length)];
      }
      return {
        ...d,
        status: newStatus,
        power: d.status === 'offline' ? 0 : parseFloat((d.power + powerChange).toFixed(2)),
        temp: parseFloat((d.temp + tempChange).toFixed(1)),
      };
    });

    const message = JSON.stringify({ type: 'DEVICE_UPDATE', devices });
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }, 3000);

  // API routes
  app.use(express.json());

  // Devices CRUD
  app.get("/api/devices", (req, res) => res.json(devices));
  app.post("/api/devices", (req, res) => {
    const newDevice = { ...req.body, id: Math.random().toString(36).substr(2, 9), status: 'offline', power: 0, voltage: 0, temp: 25 };
    devices.push(newDevice);
    res.status(201).json(newDevice);
  });
  app.put("/api/devices/:id", (req, res) => {
    const { id } = req.params;
    devices = devices.map(d => d.id === id ? { ...d, ...req.body } : d);
    res.json(devices.find(d => d.id === id));
  });
  app.delete("/api/devices/:id", (req, res) => {
    const { id } = req.params;
    devices = devices.filter(d => d.id !== id);
    res.status(204).send();
  });

  // Users CRUD
  app.get("/api/users", (req, res) => res.json(users));
  app.post("/api/users", (req, res) => {
    const newUser = { ...req.body, id: Math.random().toString(36).substr(2, 9) };
    users.push(newUser);
    res.status(201).json(newUser);
  });
  app.put("/api/users/:id", (req, res) => {
    const { id } = req.params;
    users = users.map(u => u.id === id ? { ...u, ...req.body } : u);
    res.json(users.find(u => u.id === id));
  });
  app.delete("/api/users/:id", (req, res) => {
    const { id } = req.params;
    users = users.filter(u => u.id !== id);
    res.status(204).send();
  });

  app.get("/api/telemetry/:deviceId", (req, res) => {
    const { deviceId } = req.params;
    const now = new Date();
    const data = Array.from({ length: 20 }).map((_, i) => ({
      timestamp: new Date(now.getTime() - (19 - i) * 5000).toISOString(),
      power: 10 + Math.random() * 5 + Math.sin(i / 2) * 2,
      voltage: 230 + Math.random() * 2,
      current: 4 + Math.random() * 1,
    }));
    res.json(data);
  });

  app.get("/api/overview", (req, res) => {
    res.json({
      totalConsumption: 1245.8,
      activeDevices: devices.filter(d => d.status === 'online').length,
      systemHealth: "Optimal",
      lastUpdate: new Date().toISOString(),
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
