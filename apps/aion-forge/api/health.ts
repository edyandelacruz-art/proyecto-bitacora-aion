export default function handler(_request: any, response: any) {
  response.setHeader('Cache-Control', 'no-store');
  response.status(200).json({
    service: 'aion-forge',
    status: 'ok',
    controlPlane: 'vercel',
    version: '0.1.0',
    capabilities: {
      ui: 'real',
      health: 'real',
      taskPersistence: 'planned',
      homeWorker: 'planned',
      mcp: 'planned',
      providers: 'planned'
    }
  });
}
