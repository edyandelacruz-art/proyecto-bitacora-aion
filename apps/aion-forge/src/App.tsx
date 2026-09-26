import {
  Activity,
  Bot,
  CheckCircle2,
  ChevronRight,
  CircleDot,
  Cloud,
  Cpu,
  GitBranch,
  LayoutDashboard,
  PauseCircle,
  Play,
  ShieldCheck,
  Smartphone,
  Sparkles,
  TerminalSquare,
} from 'lucide-react';

const tasks = [
  { id: 'PRED-042', title: 'Corregir insufficient coverage', project: 'Predictive', status: 'VERIFYING', progress: 82 },
  { id: 'AFTER8-037', title: 'Probar dormitorio y animaciones', project: 'After Eight', status: 'RUNNING', progress: 54 },
  { id: 'BETCA-214', title: 'Auditar autenticación', project: 'BETCA', status: 'WAITING_EDYAN', progress: 91 },
];

const workers = [
  { name: 'Home PC', detail: 'AION Dev Node', status: 'online', icon: Cpu },
  { name: 'Codex Worker', detail: 'Coding', status: 'ready', icon: TerminalSquare },
  { name: 'Browser QA', detail: 'Playwright', status: 'ready', icon: Activity },
  { name: 'Vercel', detail: 'Preview / Deploy', status: 'connected', icon: Cloud },
];

function App() {
  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brandMark">AF</div>
          <div><strong>AION Forge</strong><span>Private workspace</span></div>
        </div>

        <nav>
          <button className="navItem active"><LayoutDashboard size={18} /> Command Center</button>
          <button className="navItem"><Sparkles size={18} /> Projects</button>
          <button className="navItem"><Bot size={18} /> Conversations</button>
          <button className="navItem"><CircleDot size={18} /> Tasks</button>
          <button className="navItem"><Cpu size={18} /> Workers</button>
          <button className="navItem"><ShieldCheck size={18} /> Approvals</button>
        </nav>

        <div className="sidebarFoot">
          <div className="securityState"><ShieldCheck size={16} /> Security policy active</div>
          <button className="killSwitch"><PauseCircle size={16} /> Stop all agents</button>
        </div>
      </aside>

      <main>
        <header>
          <div>
            <p className="eyebrow">COMMAND CENTER</p>
            <h1>¿Qué necesitas que haga el equipo?</h1>
            <p className="sub">Delegas el resultado. Forge organiza tareas, agentes, ejecución y verificación.</p>
          </div>
          <div className="mobileBadge"><Smartphone size={16} /> Mobile ready</div>
        </header>

        <section className="commandCard">
          <textarea defaultValue="Para hoy corrige Predictive y prueba After Eight. No hagas producción." aria-label="Nueva instrucción" />
          <div className="commandActions">
            <span>Supervisor: OpenAI · Production: blocked</span>
            <div>
              <button className="secondary">Planificar</button>
              <button className="primary"><Play size={16} /> Ejecutar</button>
            </div>
          </div>
        </section>

        <section className="statusGrid">
          {workers.map(({ name, detail, status, icon: Icon }) => (
            <article className="statusCard" key={name}>
              <div className="iconBox"><Icon size={20} /></div>
              <div><strong>{name}</strong><span>{detail}</span></div>
              <span className="onlineDot">{status}</span>
            </article>
          ))}
        </section>

        <div className="contentGrid">
          <section className="panel">
            <div className="panelTitle"><div><p className="eyebrow">ACTIVE WORK</p><h2>Tareas en ejecución</h2></div><button className="textButton">Ver todas <ChevronRight size={16} /></button></div>
            <div className="taskList">
              {tasks.map((task) => (
                <div className="task" key={task.id}>
                  <div className="taskMain">
                    <div className="taskId"><GitBranch size={15} /> {task.id}</div>
                    <strong>{task.title}</strong>
                    <span>{task.project} · {task.status}</span>
                  </div>
                  <div className="progressWrap">
                    <div className="progressMeta"><span>{task.progress}%</span><span>{task.status === 'WAITING_EDYAN' ? 'Approval required' : 'Working'}</span></div>
                    <div className="progressTrack"><div className="progressBar" style={{ width: `${task.progress}%` }} /></div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="panel compact">
            <div className="panelTitle"><div><p className="eyebrow">SUPERVISOR</p><h2>Equipo</h2></div></div>
            <div className="teamRow"><div className="avatar">O</div><div><strong>OpenAI Supervisor</strong><span>Coordinando 3 tasks</span></div><CheckCircle2 size={18} /></div>
            <div className="teamRow"><div className="avatar muted">C</div><div><strong>Codex Worker</strong><span>After Eight</span></div><CircleDot size={18} /></div>
            <div className="teamRow"><div className="avatar muted">Q</div><div><strong>QA Reviewer</strong><span>Predictive</span></div><CircleDot size={18} /></div>
            <button className="wideSecondary">Abrir equipo</button>
          </section>
        </div>

        <section className="approvalBanner">
          <div className="approvalIcon"><ShieldCheck size={24} /></div>
          <div><p className="eyebrow">WAITING FOR EDYAN</p><h3>BETCA-214 necesita aprobación</h3><span>El worker terminó la auditoría. No se hará merge hasta tu decisión.</span></div>
          <div className="approvalActions"><button className="secondary">Revisar</button><button className="primary">Aprobar</button></div>
        </section>
      </main>
    </div>
  );
}

export default App;
