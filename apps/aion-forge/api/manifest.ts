export default function handler(_request: any, response: any) {
  response.setHeader('Cache-Control', 'no-store');
  response.status(200).json({
    name: 'AION Forge',
    role: 'private multi-agent control and execution plane',
    surfaces: ['web', 'api', 'mcp-planned'],
    executionTargets: ['home-pc-planned', 'vercel-sandbox-planned', 'github-actions'],
    providers: ['openai-planned', 'codex-planned', 'gemini-planned', 'claude-planned', 'local-models-planned'],
    safety: {
      directMainWrites: false,
      productionRequiresApproval: true,
      secretsInGit: false,
      unrestrictedRemoteShell: false
    }
  });
}
