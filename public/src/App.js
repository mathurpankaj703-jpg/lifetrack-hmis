import { useState, useEffect, useCallback } from 'react';
import { supabase } from './lib/supabase';

/* ─── THEME ─────────────────────────────────────────────────────────────── */
const C = {
  bg:'#0a0f1e', surface:'#111827', card:'#1a2235', border:'#1e2d45',
  accent:'#00d4ff', accent2:'#0066ff', green:'#00e676', orange:'#ff9800',
  red:'#ff4444', purple:'#b468ff', yellow:'#ffd740', text:'#e8eaf6', muted:'#6b7a99',
};

const css = `
@import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;600;700&family=Exo+2:wght@300;400;500;600&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
body{background:${C.bg};color:${C.text};font-family:'Exo 2',sans-serif}
::-webkit-scrollbar{width:4px;height:4px}
::-webkit-scrollbar-track{background:#111}
::-webkit-scrollbar-thumb{background:#1e3a5f;border-radius:2px}

/* Layout */
.app{display:flex;height:100vh;overflow:hidden}
.sidebar{width:230px;background:${C.surface};border-right:1px solid ${C.border};display:flex;flex-direction:column;flex-shrink:0;overflow-y:auto;transition:width .3s}
.sidebar.collapsed{width:56px}
.logo-wrap{padding:16px;border-bottom:1px solid ${C.border};display:flex;align-items:center;gap:10px;min-height:60px}
.logo-icon{width:36px;height:36px;border-radius:8px;background:linear-gradient(135deg,${C.accent2},${C.accent});display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0}
.logo-text{overflow:hidden}
.logo-name{font-family:'Rajdhani',sans-serif;font-size:15px;font-weight:700;color:${C.accent};letter-spacing:1px;white-space:nowrap}
.logo-sub{font-size:9px;color:${C.muted};letter-spacing:2px;white-space:nowrap}
.nav-group{padding:8px 0}
.nav-label{font-size:9px;color:${C.muted};letter-spacing:2px;padding:4px 16px;text-transform:uppercase;white-space:nowrap;overflow:hidden}
.nav-item{display:flex;align-items:center;gap:10px;padding:9px 16px;cursor:pointer;font-size:13px;color:${C.muted};border-left:2px solid transparent;transition:all .15s;white-space:nowrap;overflow:hidden}
.nav-item:hover{color:${C.text};background:rgba(0,212,255,.05)}
.nav-item.active{color:${C.accent};background:rgba(0,212,255,.08);border-left-color:${C.accent}}
.nav-icon{font-size:16px;flex-shrink:0;width:20px;text-align:center}
.nav-badge{margin-left:auto;background:${C.accent};color:#000;font-size:9px;font-weight:700;padding:1px 6px;border-radius:8px}

/* Main area */
.main{flex:1;display:flex;flex-direction:column;overflow:hidden}
.topbar{background:${C.surface};border-bottom:1px solid ${C.border};padding:0 20px;height:54px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;gap:12px}
.topbar-left{display:flex;align-items:center;gap:12px}
.topbar-title{font-family:'Rajdhani',sans-serif;font-size:18px;font-weight:700;letter-spacing:.5px}
.topbar-right{display:flex;align-items:center;gap:10px}
.top-chip{background:${C.card};border:1px solid ${C.border};padding:4px 10px;border-radius:6px;font-size:11px;display:flex;align-items:center;gap:5px}
.top-dot{width:6px;height:6px;border-radius:50%}
.avatar{width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,${C.accent2},${C.accent});display:flex;align-items:center;justify-content:center;font-size:13px;cursor:pointer;font-weight:700;color:#000}
.content{flex:1;overflow-y:auto;padding:16px}

/* Cards & Grid */
.grid2{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.grid3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px}
.grid4{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}
.card{background:${C.card};border:1px solid ${C.border};border-radius:10px;padding:14px}
.card-title{font-family:'Rajdhani',sans-serif;font-size:13px;font-weight:600;letter-spacing:.5px;color:${C.muted};margin-bottom:12px;display:flex;align-items:center;gap:8px;text-transform:uppercase}

/* KPI */
.kpi{background:${C.card};border:1px solid ${C.border};border-radius:10px;padding:14px;position:relative;overflow:hidden;cursor:default}
.kpi::after{content:'';position:absolute;top:-10px;right:-10px;width:70px;height:70px;border-radius:50%;opacity:.06}
.kpi.blue::after{background:${C.accent}} .kpi.blue .kv{color:${C.accent}}
.kpi.green::after{background:${C.green}} .kpi.green .kv{color:${C.green}}
.kpi.orange::after{background:${C.orange}} .kpi.orange .kv{color:${C.orange}}
.kpi.purple::after{background:${C.purple}} .kpi.purple .kv{color:${C.purple}}
.kpi.red::after{background:${C.red}} .kpi.red .kv{color:${C.red}}
.kpi.yellow::after{background:${C.yellow}} .kpi.yellow .kv{color:${C.yellow}}
.kl{font-size:10px;color:${C.muted};letter-spacing:.5px;margin-bottom:5px;text-transform:uppercase}
.kv{font-family:'Rajdhani',sans-serif;font-size:26px;font-weight:700}
.ks{font-size:11px;margin-top:3px;color:${C.muted}}

/* Table */
table{width:100%;border-collapse:collapse;font-size:12px}
th{background:rgba(0,212,255,.06);color:${C.accent};font-family:'Rajdhani',sans-serif;font-size:11px;letter-spacing:.8px;padding:8px 10px;text-align:left;border-bottom:1px solid ${C.border};white-space:nowrap}
td{padding:8px 10px;border-bottom:1px solid rgba(255,255,255,.03);vertical-align:middle}
tr:hover td{background:rgba(255,255,255,.02)}
.tbl-wrap{overflow-x:auto}

/* Badges */
.badge{display:inline-block;padding:2px 8px;border-radius:4px;font-size:10px;font-weight:600;white-space:nowrap}
.bg{background:rgba(0,230,118,.15);color:${C.green}}
.bo{background:rgba(255,152,0,.15);color:${C.orange}}
.bb{background:rgba(0,212,255,.15);color:${C.accent}}
.br{background:rgba(255,68,68,.15);color:${C.red}}
.bp{background:rgba(180,104,255,.15);color:${C.purple}}
.by{background:rgba(255,215,64,.15);color:${C.yellow}}
.bm{background:rgba(107,122,153,.15);color:${C.muted}}

/* Buttons */
.btn{padding:7px 14px;border-radius:6px;border:none;cursor:pointer;font-family:'Exo 2',sans-serif;font-size:12px;font-weight:600;display:inline-flex;align-items:center;gap:6px;transition:all .15s}
.btn-p{background:linear-gradient(135deg,${C.accent2},${C.accent});color:#000}
.btn-p:hover{opacity:.9;transform:translateY(-1px)}
.btn-o{background:transparent;border:1px solid ${C.border};color:${C.muted}}
.btn-o:hover{border-color:${C.accent};color:${C.accent}}
.btn-r{background:rgba(255,68,68,.15);border:1px solid rgba(255,68,68,.3);color:${C.red}}
.btn-sm{padding:4px 10px;font-size:11px}

/* Forms */
.form-row{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px}
.form-row3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:10px}
.f{display:flex;flex-direction:column;gap:4px}
.f label{font-size:10px;color:${C.muted};letter-spacing:.5px;text-transform:uppercase}
.f input,.f select,.f textarea{background:${C.surface};border:1px solid ${C.border};border-radius:6px;padding:8px 10px;color:${C.text};font-family:'Exo 2',sans-serif;font-size:12px;outline:none;transition:border-color .2s;width:100%}
.f input:focus,.f select:focus,.f textarea:focus{border-color:${C.accent}}
.f select option{background:${C.surface}}

/* Misc */
.sec-hdr{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;flex-wrap:wrap;gap:8px}
.sec-title{font-family:'Rajdhani',sans-serif;font-size:20px;font-weight:700;letter-spacing:.5px}
.tab-row{display:flex;gap:4px;margin-bottom:14px;background:${C.surface};padding:4px;border-radius:8px;border:1px solid ${C.border};flex-wrap:wrap}
.tab{padding:7px 12px;border-radius:6px;cursor:pointer;font-size:12px;font-weight:500;color:${C.muted};transition:all .15s;white-space:nowrap}
.tab.active{background:linear-gradient(135deg,${C.accent2},${C.accent});color:#000;font-weight:700}
.stat-row{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px}
.chip{background:${C.surface};border:1px solid ${C.border};border-radius:6px;padding:5px 12px;font-size:12px;display:flex;align-items:center;gap:6px}
.pb{background:rgba(255,255,255,.07);border-radius:4px;height:5px;overflow:hidden;margin-top:3px}
.pf{height:100%;border-radius:4px;transition:width .6s ease}
.alert{background:rgba(255,152,0,.07);border:1px solid rgba(255,152,0,.25);border-radius:8px;padding:10px 14px;font-size:12px;margin-bottom:8px;display:flex;align-items:center;gap:10px}
.alert.red{background:rgba(255,68,68,.07);border-color:rgba(255,68,68,.25)}
.divider{border:none;border-top:1px solid ${C.border};margin:12px 0}
.tl{position:relative;padding-left:18px}
.tl::before{content:'';position:absolute;left:5px;top:0;bottom:0;width:1px;background:${C.border}}
.tl-item{position:relative;margin-bottom:10px}
.tl-dot{position:absolute;left:-16px;width:9px;height:9px;border-radius:50%;top:3px}
.tl-t{font-size:10px;color:${C.muted}}
.tl-x{font-size:12px;margin-top:2px}
.bed-grid{display:flex;flex-wrap:wrap;gap:4px;margin-top:8px}
.bed{width:26px;height:26px;border-radius:4px;font-size:9px;display:flex;align-items:center;justify-content:center;font-weight:700;cursor:pointer;transition:transform .1s}
.bed:hover{transform:scale(1.15)}
.bed-occ{background:${C.red};color:#fff}
.bed-avl{background:rgba(0,230,118,.15);border:1px solid ${C.green};color:${C.green}}
.bed-res{background:rgba(255,152,0,.15);border:1px solid ${C.orange};color:${C.orange}}
.empty-state{text-align:center;padding:40px;color:${C.muted};font-size:13px}
.spin{display:inline-block;width:16px;height:16px;border:2px solid rgba(0,212,255,.3);border-top-color:${C.accent};border-radius:50%;animation:spin .7s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
.saving{font-size:11px;color:${C.muted};display:flex;align-items:center;gap:6px}

/* Login */
.login-wrap{min-height:100vh;display:flex;align-items:center;justify-content:center;background:radial-gradient(ellipse at 30% 20%, rgba(0,102,255,.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 80%, rgba(0,212,255,.05) 0%, transparent 60%), ${C.bg}}
.login-card{background:${C.surface};border:1px solid ${C.border};border-radius:16px;padding:40px;width:100%;max-width:380px;box-shadow:0 24px 80px rgba(0,0,0,.5)}
.login-logo{display:flex;align-items:center;gap:12px;margin-bottom:32px;justify-content:center}
.login-logo-icon{width:48px;height:48px;border-radius:12px;background:linear-gradient(135deg,${C.accent2},${C.accent});display:flex;align-items:center;justify-content:center;font-size:24px}
.login-title{font-family:'Rajdhani',sans-serif;font-size:22px;font-weight:700;color:${C.accent};letter-spacing:1px}
.login-sub{font-size:11px;color:${C.muted};letter-spacing:2px}
.login-head{font-family:'Rajdhani',sans-serif;font-size:26px;font-weight:700;margin-bottom:6px}
.login-desc{font-size:13px;color:${C.muted};margin-bottom:28px}
.login-field{margin-bottom:16px}
.login-field label{display:block;font-size:11px;color:${C.muted};letter-spacing:.5px;text-transform:uppercase;margin-bottom:6px}
.login-field input{width:100%;background:${C.card};border:1px solid ${C.border};border-radius:8px;padding:10px 14px;color:${C.text};font-family:'Exo 2',sans-serif;font-size:13px;outline:none;transition:border-color .2s}
.login-field input:focus{border-color:${C.accent}}
.login-btn{width:100%;padding:11px;border-radius:8px;border:none;background:linear-gradient(135deg,${C.accent2},${C.accent});color:#000;font-family:'Rajdhani',sans-serif;font-size:16px;font-weight:700;cursor:pointer;letter-spacing:1px;margin-top:8px;transition:opacity .2s}
.login-btn:hover{opacity:.9}
.login-err{background:rgba(255,68,68,.1);border:1px solid rgba(255,68,68,.3);border-radius:6px;padding:8px 12px;font-size:12px;color:${C.red};margin-bottom:12px}

/* Responsive */
@media(max-width:768px){
  .grid4{grid-template-columns:1fr 1fr}
  .grid3{grid-template-columns:1fr 1fr}
  .grid2{grid-template-columns:1fr}
  .sidebar{position:fixed;z-index:100;height:100%;transform:translateX(-100%);transition:transform .3s}
  .sidebar.mobile-open{transform:translateX(0)}
  .main{width:100%}
  .form-row3{grid-template-columns:1fr 1fr}
}
`;

/* ─── CONSTANTS ─────────────────────────────────────────────────────────── */
const DEPTS = ['General Medicine','Urology','Neuro Surgery','General Surgery','Orthopedics','Gynecology','Pediatrics','Cardiology','ENT','Ophthalmology','Dermatology','Psychiatry'];
const TPAS = ['Ayushman Bharat','Star Health','New India Assurance','United India','CGHS','ECHS','Niva Bupa','Aditya Birla Health','HDFC ERGO','ICICI Lombard'];
const WARDS = ['Male Ward','Female Ward','ICU','NICU','Private Ward','General Ward','Semi-Private','Emergency Ward'];
const PAY_TYPES = ['Cash','Ayushman','TPA - Star Health','TPA - New India','TPA - CGHS','TPA - ECHS','TPA - Niva Bupa','TPA - Aditya Birla','TPA - HDFC ERGO','TPA - ICICI Lombard'];
const ROLES = ['Doctor','Nurse','Ward Boy','Lab Technician','Receptionist','Cashier','Pharmacist','Housekeeping','Security','Admin'];
const fmt = n => '₹' + Number(n||0).toLocaleString('en-IN');
const today = () => new Date().toISOString().split('T')[0];
const now = () => new Date().toLocaleTimeString('hi-IN',{hour:'2-digit',minute:'2-digit'});

/* ─── LOGIN ─────────────────────────────────────────────────────────────── */
function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const handleLogin = async () => {
    setLoading(true); setErr('');
    const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
    if (error) setErr('गलत Email या Password। कृपया दोबारा कोशिश करें।');
    setLoading(false);
  };

  const handleSignup = async () => {
    if (!email || !pass) { setErr('Email और Password दोनों भरें।'); return; }
    setLoading(true); setErr('');
    const { error } = await supabase.auth.signUp({ email, password: pass });
    if (error) setErr(error.message);
    else setErr('✅ Account बना! अब Login करें।');
    setLoading(false);
  };

  return (
    <div className="login-wrap">
      <div className="login-card">
        <div className="login-logo">
          <div className="login-logo-icon">🏥</div>
          <div><div className="login-title">MEDICARE HMS</div><div className="login-sub">HOSPITAL MANAGEMENT SYSTEM</div></div>
        </div>
        <div className="login-head">Welcome Back</div>
        <div className="login-desc">अपना Account Login करें</div>
        {err && <div className="login-err">{err}</div>}
        <div className="login-field"><label>Email</label><input type="email" placeholder="admin@hospital.com" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleLogin()}/></div>
        <div className="login-field"><label>Password</label><input type="password" placeholder="••••••••" value={pass} onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleLogin()}/></div>
        <button className="login-btn" onClick={handleLogin} disabled={loading}>{loading?'Logging in...':'🔐 Login'}</button>
        <div style={{textAlign:'center',marginTop:14,fontSize:12,color:C.muted}}>
          पहली बार? <span style={{color:C.accent,cursor:'pointer'}} onClick={handleSignup}>Account बनाएं</span>
        </div>
      </div>
    </div>
  );
}

/* ─── DASHBOARD ─────────────────────────────────────────────────────────── */
function Dashboard({ counts }) {
  const deptData = [['General Medicine',28],['General Surgery',21],['Gynecology',18],['Orthopedics',16],['Cardiology',14],['Urology',11],['Neuro Surgery',9],['Pediatrics',15]];
  const colors = [C.accent,C.green,C.purple,C.orange,C.yellow,C.accent,C.red,C.green];
  const wardData = [{n:'Male Ward',t:30,o:22},{n:'Female Ward',t:25,o:18},{n:'ICU',t:10,o:8},{n:'General Ward',t:40,o:29}];
  return (
    <div>
      <div className="sec-hdr"><div className="sec-title">📊 Dashboard</div><div style={{fontSize:11,color:C.muted}}>{new Date().toLocaleDateString('hi-IN',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}</div></div>
      <div className="grid4" style={{marginBottom:12}}>
        <div className="kpi blue"><div className="kl">IPD Patients</div><div className="kv">{counts.ipd}</div><div className="ks">Active भर्ती</div></div>
        <div className="kpi green"><div className="kl">OPD Today</div><div className="kv">{counts.opd}</div><div className="ks">आज रजिस्टर्ड</div></div>
        <div className="kpi orange"><div className="kl">Employees</div><div className="kv">{counts.emp}</div><div className="ks">कुल स्टाफ</div></div>
        <div className="kpi purple"><div className="kl">Lab Tests</div><div className="kv">{counts.lab}</div><div className="ks">कुल Records</div></div>
      </div>
      <div className="grid2" style={{marginBottom:12}}>
        <div className="card">
          <div className="card-title">🏬 Department-wise Load</div>
          {deptData.map(([d,n],i)=>(
            <div key={d} style={{marginBottom:8}}>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:11,marginBottom:2}}><span>{d}</span><span style={{color:colors[i],fontWeight:600}}>{n}</span></div>
              <div className="pb"><div className="pf" style={{width:`${Math.round(n/30*100)}%`,background:colors[i]}}/></div>
            </div>
          ))}
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:10}}>
          <div className="card">
            <div className="card-title">🛏️ Ward Occupancy</div>
            {wardData.map(w=>(
              <div key={w.n} style={{marginBottom:8}}>
                <div style={{display:'flex',justifyContent:'space-between',fontSize:11,marginBottom:2}}>
                  <span>{w.n}</span>
                  <span><span style={{color:C.red}}>{w.o}</span>/<span style={{color:C.muted}}>{w.t}</span></span>
                </div>
                <div className="pb"><div className="pf" style={{width:`${Math.round(w.o/w.t*100)}%`,background:w.o/w.t>0.9?C.red:w.o/w.t>0.7?C.orange:C.green}}/></div>
              </div>
            ))}
          </div>
          <div className="card">
            <div className="card-title">💰 Revenue Mix (This Month)</div>
            {[['Cash','₹3,34,000',C.accent,'48%'],['TPA','₹2,25,000',C.orange,'32%'],['Ayushman','₹1,41,000',C.green,'20%']].map(([l,v,c,p])=>(
              <div key={l} style={{display:'flex',justifyContent:'space-between',marginBottom:10,alignItems:'center'}}>
                <div style={{display:'flex',alignItems:'center',gap:8}}><div style={{width:8,height:8,borderRadius:2,background:c}}/><span style={{fontSize:12}}>{l}</span></div>
                <div style={{textAlign:'right'}}><div style={{fontSize:12,color:c,fontWeight:600}}>{v}</div><div style={{fontSize:10,color:C.muted}}>{p}</div></div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="alert"><span>⚠️</span><span>3 TPA Claims pending — Star Health, CGHS, Niva Bupa — total ₹95,200</span></div>
      <div className="alert red"><span>🔴</span><span>ICU mein 8/10 beds occupied — Critical capacity near</span></div>
    </div>
  );
}

/* ─── OPD ───────────────────────────────────────────────────────────────── */
function OPD() {
  const [tab, setTab] = useState('list');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name:'', age:'', gender:'Male', mobile:'', aadhaar:'', department:'', pay_type:'Cash', tpa:'', referred_by:'', complaints:'', address:'' });

  const load = useCallback(async () => {
    setLoading(true);
    const { data: rows } = await supabase.from('opd_patients').select('*').order('created_at', { ascending: false }).limit(100);
    setData(rows || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const save = async () => {
    if (!form.name || !form.age || !form.department) { alert('नाम, उम्र और Department जरूरी है!'); return; }
    setSaving(true);
    const token = data.filter(d => d.date === today()).length + 1;
    await supabase.from('opd_patients').insert([{ ...form, date: today(), time: now(), token_no: token, status: 'Waiting' }]);
    setForm({ name:'', age:'', gender:'Male', mobile:'', aadhaar:'', department:'', pay_type:'Cash', tpa:'', referred_by:'', complaints:'', address:'' });
    setSaving(false);
    load();
    setTab('list');
  };

  const statusUpdate = async (id, status) => {
    await supabase.from('opd_patients').update({ status }).eq('id', id);
    load();
  };

  const todayRecs = data.filter(d => d.date === today());

  return (
    <div>
      <div className="sec-hdr"><div className="sec-title">🩺 OPD Registration</div><button className="btn btn-p btn-sm" onClick={()=>setTab('new')}>+ New OPD</button></div>
      <div className="tab-row">{['list','new'].map(t=><div key={t} className={`tab ${tab===t?'active':''}`} onClick={()=>setTab(t)}>{t==='list'?'📋 आज की List':'➕ New Registration'}</div>)}</div>
      {tab==='list' && <>
        <div className="stat-row">
          {[['आज कुल',todayRecs.length,C.accent],['Seen',todayRecs.filter(x=>x.status==='Seen').length,C.green],['Waiting',todayRecs.filter(x=>x.status==='Waiting').length,C.orange],['Pending',todayRecs.filter(x=>x.status==='Pending').length,C.muted]].map(([l,v,c])=>(
            <div className="chip" key={l}><div style={{width:7,height:7,borderRadius:2,background:c}}/><span>{l}:</span><strong style={{color:c}}>{v}</strong></div>
          ))}
        </div>
        {loading ? <div className="empty-state"><div className="spin" style={{margin:'0 auto'}}/></div> :
        data.length === 0 ? <div className="empty-state">कोई OPD record नहीं मिला। पहला patient register करें!</div> :
        <div className="card"><div className="tbl-wrap"><table>
          <thead><tr><th>Token</th><th>OPD ID</th><th>Patient</th><th>Age</th><th>Dept</th><th>Time</th><th>Type</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>{data.slice(0,50).map(p=>(
            <tr key={p.id}>
              <td><strong style={{color:C.accent}}>#{p.token_no}</strong></td>
              <td style={{color:C.muted,fontSize:11}}>OPD-{String(p.id).slice(0,6)}</td>
              <td><strong>{p.name}</strong><br/><span style={{fontSize:10,color:C.muted}}>{p.mobile}</span></td>
              <td>{p.age}</td>
              <td style={{fontSize:11}}>{p.department}</td>
              <td style={{fontSize:11,color:C.muted}}>{p.time}</td>
              <td><span className={`badge ${p.pay_type==='Cash'?'bb':p.pay_type==='Ayushman'?'bg':'bo'}`}>{p.pay_type}</span></td>
              <td><span className={`badge ${p.status==='Seen'?'bg':p.status==='Waiting'?'bo':'bp'}`}>{p.status}</span></td>
              <td style={{display:'flex',gap:4}}>
                <button className="btn btn-o btn-sm" onClick={()=>statusUpdate(p.id,'Seen')}>✓ Seen</button>
              </td>
            </tr>
          ))}</tbody>
        </table></div></div>}
      </>}
      {tab==='new' && <div className="card">
        <div className="card-title">New OPD Registration</div>
        <div className="form-row"><div className="f"><label>Patient Name *</label><input placeholder="पूरा नाम" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></div><div className="f"><label>Age *</label><input type="number" placeholder="उम्र" value={form.age} onChange={e=>setForm({...form,age:e.target.value})}/></div></div>
        <div className="form-row3"><div className="f"><label>Gender</label><select value={form.gender} onChange={e=>setForm({...form,gender:e.target.value})}><option>Male</option><option>Female</option><option>Other</option></select></div><div className="f"><label>Mobile</label><input placeholder="मोबाइल नंबर" value={form.mobile} onChange={e=>setForm({...form,mobile:e.target.value})}/></div><div className="f"><label>Aadhaar</label><input placeholder="आधार नंबर" value={form.aadhaar} onChange={e=>setForm({...form,aadhaar:e.target.value})}/></div></div>
        <div className="form-row"><div className="f"><label>Department *</label><select value={form.department} onChange={e=>setForm({...form,department:e.target.value})}><option value="">Select...</option>{DEPTS.map(d=><option key={d}>{d}</option>)}</select></div><div className="f"><label>Referred By</label><input placeholder="Doctor/Hospital/Self" value={form.referred_by} onChange={e=>setForm({...form,referred_by:e.target.value})}/></div></div>
        <div className="form-row3"><div className="f"><label>Payment Type</label><select value={form.pay_type} onChange={e=>setForm({...form,pay_type:e.target.value})}>{PAY_TYPES.map(t=><option key={t}>{t}</option>)}</select></div><div className="f"><label>TPA Name</label><select value={form.tpa} onChange={e=>setForm({...form,tpa:e.target.value})}><option value="">N/A</option>{TPAS.map(t=><option key={t}>{t}</option>)}</select></div><div className="f"><label>Insurance/Card No.</label><input placeholder="Policy Number" value={form.aadhaar} onChange={e=>setForm({...form,aadhaar:e.target.value})}/></div></div>
        <div className="form-row"><div className="f"><label>Complaints</label><input placeholder="मुख्य शिकायत" value={form.complaints} onChange={e=>setForm({...form,complaints:e.target.value})}/></div><div className="f"><label>Address</label><input placeholder="पता" value={form.address} onChange={e=>setForm({...form,address:e.target.value})}/></div></div>
        <div style={{display:'flex',alignItems:'center',gap:12,marginTop:8}}>
          <button className="btn btn-p" onClick={save} disabled={saving}>{saving?<><span className="spin"/>&nbsp;Saving...</>:'✅ Register OPD'}</button>
          <button className="btn btn-o" onClick={()=>setTab('list')}>Cancel</button>
        </div>
      </div>}
    </div>
  );
}

/* ─── IPD ───────────────────────────────────────────────────────────────── */
function IPD() {
  const [tab, setTab] = useState('list');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name:'', age:'', gender:'Male', mobile:'', aadhaar:'', department:'', doctor:'', ward:'', bed_no:'', pay_type:'Cash', tpa:'', referred_by:'', diagnosis:'', attendant_name:'', attendant_mobile:'', admission_date:today() });
  const [discharge, setDischarge] = useState({ ipd_id:'', discharge_date:today(), final_diagnosis:'', condition:'Improved', summary:'', followup_date:'', medicines:'' });

  const load = useCallback(async () => {
    setLoading(true);
    const { data: rows } = await supabase.from('ipd_patients').select('*').order('created_at', { ascending: false });
    setData(rows || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const admitPatient = async () => {
    if (!form.name || !form.age || !form.department || !form.ward) { alert('नाम, उम्र, Department और Ward जरूरी है!'); return; }
    setSaving(true);
    await supabase.from('ipd_patients').insert([{ ...form, status: 'Active', total_expense: 0 }]);
    setForm({ name:'', age:'', gender:'Male', mobile:'', aadhaar:'', department:'', doctor:'', ward:'', bed_no:'', pay_type:'Cash', tpa:'', referred_by:'', diagnosis:'', attendant_name:'', attendant_mobile:'', admission_date:today() });
    setSaving(false); load(); setTab('list');
  };

  const doDischarge = async () => {
    if (!discharge.ipd_id) { alert('IPD ID डालें!'); return; }
    setSaving(true);
    await supabase.from('ipd_patients').update({ status:'Discharged', discharge_date:discharge.discharge_date, discharge_condition:discharge.condition, discharge_summary:discharge.summary, followup_date:discharge.followup_date }).eq('id', discharge.ipd_id);
    setSaving(false); load(); setTab('list');
  };

  const active = data.filter(d=>d.status==='Active');

  return (
    <div>
      <div className="sec-hdr"><div className="sec-title">🛏️ IPD Management</div><div style={{display:'flex',gap:8}}><button className="btn btn-p btn-sm" onClick={()=>setTab('admit')}>+ Admit</button><button className="btn btn-o btn-sm" onClick={()=>setTab('discharge')}>📤 Discharge</button></div></div>
      <div className="tab-row">{[['list','📋 Active IPD'],['admit','➕ Admission'],['discharge','📤 Discharge'],['all','📂 All Records']].map(([t,l])=><div key={t} className={`tab ${tab===t?'active':''}`} onClick={()=>setTab(t)}>{l}</div>)}</div>

      {(tab==='list'||tab==='all') && <>
        <div className="stat-row">
          {[['Active',active.length,C.green],['Total',data.length,C.accent],['Discharged',data.filter(x=>x.status==='Discharged').length,C.muted]].map(([l,v,c])=>(
            <div className="chip" key={l}><div style={{width:7,height:7,borderRadius:2,background:c}}/>{l}: <strong style={{color:c}}>{v}</strong></div>
          ))}
        </div>
        {loading ? <div className="empty-state"><div className="spin" style={{margin:'0 auto'}}/></div> :
        data.length===0 ? <div className="empty-state">कोई IPD Patient नहीं। पहला patient admit करें!</div> :
        <div className="card"><div className="tbl-wrap"><table>
          <thead><tr><th>ID</th><th>Patient</th><th>Dept</th><th>Ward/Bed</th><th>Days</th><th>Payment</th><th>Referred By</th><th>Expense</th><th>Status</th></tr></thead>
          <tbody>{(tab==='list'?active:data).map(p=>{
            const days = p.admission_date ? Math.floor((new Date()-new Date(p.admission_date))/86400000) : 0;
            return (
              <tr key={p.id}>
                <td style={{color:C.accent,fontSize:11}}>IPD-{String(p.id).slice(0,6)}</td>
                <td><strong>{p.name}</strong><br/><span style={{fontSize:10,color:C.muted}}>{p.mobile} | {p.age}y/{p.gender?.[0]}</span></td>
                <td style={{fontSize:11,color:C.muted}}>{p.department}</td>
                <td><span style={{color:C.orange}}>{p.ward}</span><br/><span style={{fontSize:10,color:C.muted}}>Bed: {p.bed_no}</span></td>
                <td style={{color:C.yellow}}>{days}d</td>
                <td><span className={`badge ${p.pay_type==='Cash'?'bb':p.pay_type==='Ayushman'?'bg':'bo'}`}>{p.pay_type}</span>{p.tpa&&<><br/><span style={{fontSize:10,color:C.muted}}>{p.tpa}</span></>}</td>
                <td style={{fontSize:11,color:C.muted}}>{p.referred_by||'—'}</td>
                <td style={{color:C.purple}}>{fmt(p.total_expense)}</td>
                <td><span className={`badge ${p.status==='Active'?'bg':p.status==='Discharged'?'bm':'br'}`}>{p.status}</span></td>
              </tr>
            );
          })}</tbody>
        </table></div></div>}
      </>}

      {tab==='admit' && <div className="card">
        <div className="card-title">IPD Admission Form</div>
        <div className="form-row"><div className="f"><label>Patient Name *</label><input placeholder="पूरा नाम" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></div><div className="f"><label>Age *</label><input type="number" placeholder="उम्र" value={form.age} onChange={e=>setForm({...form,age:e.target.value})}/></div></div>
        <div className="form-row3"><div className="f"><label>Gender</label><select value={form.gender} onChange={e=>setForm({...form,gender:e.target.value})}><option>Male</option><option>Female</option><option>Other</option></select></div><div className="f"><label>Mobile</label><input placeholder="मोबाइल" value={form.mobile} onChange={e=>setForm({...form,mobile:e.target.value})}/></div><div className="f"><label>Aadhaar</label><input placeholder="आधार" value={form.aadhaar} onChange={e=>setForm({...form,aadhaar:e.target.value})}/></div></div>
        <div className="form-row3"><div className="f"><label>Admission Date</label><input type="date" value={form.admission_date} onChange={e=>setForm({...form,admission_date:e.target.value})}/></div><div className="f"><label>Department *</label><select value={form.department} onChange={e=>setForm({...form,department:e.target.value})}><option value="">Select...</option>{DEPTS.map(d=><option key={d}>{d}</option>)}</select></div><div className="f"><label>Doctor</label><input placeholder="Doctor Name" value={form.doctor} onChange={e=>setForm({...form,doctor:e.target.value})}/></div></div>
        <div className="form-row3"><div className="f"><label>Ward *</label><select value={form.ward} onChange={e=>setForm({...form,ward:e.target.value})}><option value="">Select...</option>{WARDS.map(w=><option key={w}>{w}</option>)}</select></div><div className="f"><label>Bed No.</label><input placeholder="Bed Number" value={form.bed_no} onChange={e=>setForm({...form,bed_no:e.target.value})}/></div><div className="f"><label>Payment Type</label><select value={form.pay_type} onChange={e=>setForm({...form,pay_type:e.target.value})}>{PAY_TYPES.map(t=><option key={t}>{t}</option>)}</select></div></div>
        <div className="form-row3"><div className="f"><label>TPA Name</label><select value={form.tpa} onChange={e=>setForm({...form,tpa:e.target.value})}><option value="">N/A</option>{TPAS.map(t=><option key={t}>{t}</option>)}</select></div><div className="f"><label>Referred By</label><input placeholder="Doctor/Hospital/Self" value={form.referred_by} onChange={e=>setForm({...form,referred_by:e.target.value})}/></div><div className="f"><label>Diagnosis</label><input placeholder="Primary Diagnosis" value={form.diagnosis} onChange={e=>setForm({...form,diagnosis:e.target.value})}/></div></div>
        <div className="form-row"><div className="f"><label>Attendant Name</label><input placeholder="मरीज के साथी का नाम" value={form.attendant_name} onChange={e=>setForm({...form,attendant_name:e.target.value})}/></div><div className="f"><label>Attendant Mobile</label><input placeholder="मोबाइल" value={form.attendant_mobile} onChange={e=>setForm({...form,attendant_mobile:e.target.value})}/></div></div>
        <div style={{display:'flex',gap:10,marginTop:8}}>
          <button className="btn btn-p" onClick={admitPatient} disabled={saving}>{saving?<><span className="spin"/>&nbsp;Saving...</>:'✅ Admit Patient'}</button>
          <button className="btn btn-o" onClick={()=>setTab('list')}>Cancel</button>
        </div>
      </div>}

      {tab==='discharge' && <div className="card">
        <div className="card-title">Discharge Summary</div>
        <div className="form-row"><div className="f"><label>IPD ID (from list)</label><input placeholder="UUID from IPD list" value={discharge.ipd_id} onChange={e=>setDischarge({...discharge,ipd_id:e.target.value})}/></div><div className="f"><label>Discharge Date</label><input type="date" value={discharge.discharge_date} onChange={e=>setDischarge({...discharge,discharge_date:e.target.value})}/></div></div>
        <div className="form-row"><div className="f"><label>Final Diagnosis</label><input placeholder="Final diagnosis" value={discharge.final_diagnosis} onChange={e=>setDischarge({...discharge,final_diagnosis:e.target.value})}/></div><div className="f"><label>Condition at Discharge</label><select value={discharge.condition} onChange={e=>setDischarge({...discharge,condition:e.target.value})}><option>Improved</option><option>Stable</option><option>LAMA</option><option>Expired</option><option>Referred</option></select></div></div>
        <div className="f" style={{marginBottom:10}}><label>Discharge Summary</label><textarea rows={4} placeholder="Treatment given, medications, follow-up..." value={discharge.summary} onChange={e=>setDischarge({...discharge,summary:e.target.value})}/></div>
        <div className="form-row"><div className="f"><label>Follow-up Date</label><input type="date" value={discharge.followup_date} onChange={e=>setDischarge({...discharge,followup_date:e.target.value})}/></div><div className="f"><label>Discharge Medicines</label><input placeholder="Medications on discharge" value={discharge.medicines} onChange={e=>setDischarge({...discharge,medicines:e.target.value})}/></div></div>
        <button className="btn btn-p" onClick={doDischarge} disabled={saving}>{saving?<><span className="spin"/>&nbsp;Saving...</>:'📤 Discharge Patient'}</button>
      </div>}
    </div>
  );
}

/* ─── BED TRACKING ──────────────────────────────────────────────────────── */
function Beds() {
  const wardData = [
    {name:'Male Ward',beds:30,occupied:22},{name:'Female Ward',beds:25,occupied:18},
    {name:'ICU',beds:10,occupied:8},{name:'NICU',beds:8,occupied:5},
    {name:'Private Ward',beds:20,occupied:13},{name:'General Ward',beds:40,occupied:31},
    {name:'Semi-Private',beds:15,occupied:9},{name:'Emergency Ward',beds:8,occupied:6},
  ];
  const total = wardData.reduce((a,w)=>a+w.beds,0);
  const occ = wardData.reduce((a,w)=>a+w.occupied,0);
  return (
    <div>
      <div className="sec-hdr"><div className="sec-title">🏥 Bed & Ward Tracking</div>
        <div style={{display:'flex',gap:12,fontSize:12,flexWrap:'wrap'}}>
          <span><span style={{color:C.red}}>🟥</span> Occupied</span>
          <span><span style={{color:C.green}}>🟩</span> Available</span>
          <span><span style={{color:C.orange}}>🟧</span> Reserved</span>
        </div>
      </div>
      <div className="grid4" style={{marginBottom:12}}>
        <div className="kpi blue"><div className="kl">Total Beds</div><div className="kv">{total}</div></div>
        <div className="kpi red"><div className="kl">Occupied</div><div className="kv">{occ}</div></div>
        <div className="kpi green"><div className="kl">Available</div><div className="kv">{total-occ}</div></div>
        <div className="kpi orange"><div className="kl">Occupancy %</div><div className="kv">{Math.round(occ/total*100)}%</div></div>
      </div>
      <div className="grid2">
        {wardData.map(ward=>{
          const avail = ward.beds - ward.occupied;
          const pct = Math.round(ward.occupied/ward.beds*100);
          return (
            <div key={ward.name} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:14}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}>
                <span style={{fontFamily:'Rajdhani,sans-serif',fontSize:15,fontWeight:700}}>{ward.name}</span>
                <span style={{fontSize:11}}><span style={{color:C.red}}>{ward.occupied} Occ</span> | <span style={{color:C.green}}>{avail} Free</span></span>
              </div>
              <div className="pb" style={{marginBottom:8}}><div className="pf" style={{width:`${pct}%`,background:pct>90?C.red:pct>70?C.orange:C.green}}/></div>
              <div className="bed-grid">
                {Array.from({length:ward.beds}).map((_,i)=>{
                  const s = i<ward.occupied?'occ':i===ward.occupied?'res':'avl';
                  return <div key={i} className={`bed bed-${s}`} title={`Bed ${i+1}`}>{i+1}</div>;
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── LAB ───────────────────────────────────────────────────────────────── */
function Lab() {
  const [tab, setTab] = useState('list');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ patient_name:'', patient_id:'', test_name:'', test_type:'Lab', doctor:'', date:today(), status:'Pending', result:'', remarks:'' });

  const load = useCallback(async () => {
    setLoading(true);
    const { data: rows } = await supabase.from('lab_records').select('*').order('created_at',{ascending:false});
    setData(rows||[]); setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const save = async () => {
    if (!form.patient_name || !form.test_name) { alert('Patient Name और Test Name जरूरी है!'); return; }
    setSaving(true);
    await supabase.from('lab_records').insert([form]);
    setForm({ patient_name:'', patient_id:'', test_name:'', test_type:'Lab', doctor:'', date:today(), status:'Pending', result:'', remarks:'' });
    setSaving(false); load(); setTab('list');
  };

  const updateStatus = async (id, status, result) => {
    await supabase.from('lab_records').update({ status, result }).eq('id', id);
    load();
  };

  return (
    <div>
      <div className="sec-hdr"><div className="sec-title">🧪 Lab / X-Ray / USG / Reports</div><button className="btn btn-p btn-sm" onClick={()=>setTab('new')}>+ New Test</button></div>
      <div className="tab-row">{[['list','📋 All Tests'],['new','➕ New Order'],['xray','X-Ray'],['usg','USG']].map(([t,l])=><div key={t} className={`tab ${tab===t?'active':''}`} onClick={()=>setTab(t)}>{l}</div>)}</div>
      <div className="stat-row">
        {[['Total',data.length,C.accent],['Done',data.filter(x=>x.status==='Done').length,C.green],['Pending',data.filter(x=>x.status==='Pending').length,C.orange],['Critical',data.filter(x=>x.result==='Critical').length,C.red]].map(([l,v,c])=>(
          <div className="chip" key={l}><div style={{width:7,height:7,borderRadius:2,background:c}}/>{l}: <strong style={{color:c}}>{v}</strong></div>
        ))}
      </div>
      {(tab==='list'||tab==='xray'||tab==='usg') && <>
        {loading ? <div className="empty-state"><div className="spin" style={{margin:'0 auto'}}/></div> :
        data.length===0 ? <div className="empty-state">कोई Lab record नहीं। पहला test order करें!</div> :
        <div className="card"><div className="tbl-wrap"><table>
          <thead><tr><th>ID</th><th>Patient</th><th>Test</th><th>Type</th><th>Doctor</th><th>Date</th><th>Status</th><th>Result</th><th>Action</th></tr></thead>
          <tbody>{data.filter(r=>tab==='list'||r.test_type===(tab==='xray'?'X-Ray':'USG')).map(r=>(
            <tr key={r.id}>
              <td style={{color:C.accent,fontSize:11}}>L-{String(r.id).slice(0,6)}</td>
              <td><strong>{r.patient_name}</strong></td>
              <td>{r.test_name}</td>
              <td><span className="badge bb">{r.test_type}</span></td>
              <td style={{fontSize:11,color:C.muted}}>{r.doctor}</td>
              <td style={{fontSize:11,color:C.muted}}>{r.date}</td>
              <td><span className={`badge ${r.status==='Done'?'bg':'bo'}`}>{r.status}</span></td>
              <td><span className={`badge ${r.result==='Normal'?'bg':r.result==='Abnormal'||r.result==='High'?'bo':r.result==='Critical'?'br':r.result==='Pending'?'bm':'bp'}`}>{r.result||'—'}</span></td>
              <td style={{display:'flex',gap:4',flexWrap:'wrap'}}>
                {r.status!=='Done'&&<button className="btn btn-o btn-sm" onClick={()=>updateStatus(r.id,'Done','Normal')}>✓ Done</button>}
                {r.status==='Done'&&r.result!=='Critical'&&<button className="btn btn-r btn-sm" onClick={()=>updateStatus(r.id,'Done','Critical')}>⚠ Critical</button>}
              </td>
            </tr>
          ))}</tbody>
        </table></div></div>}
      </>}
      {tab==='new' && <div className="card">
        <div className="card-title">New Test Order</div>
        <div className="form-row"><div className="f"><label>Patient Name *</label><input placeholder="Patient ka naam" value={form.patient_name} onChange={e=>setForm({...form,patient_name:e.target.value})}/></div><div className="f"><label>IPD/OPD ID</label><input placeholder="IPD/OPD reference" value={form.patient_id} onChange={e=>setForm({...form,patient_id:e.target.value})}/></div></div>
        <div className="form-row3"><div className="f"><label>Test Type</label><select value={form.test_type} onChange={e=>setForm({...form,test_type:e.target.value})}><option>Lab</option><option>X-Ray</option><option>USG</option><option>MRI</option><option>CT Scan</option><option>ECG</option><option>Echo</option><option>Other</option></select></div><div className="f"><label>Test Name *</label><input placeholder="Test ka naam" value={form.test_name} onChange={e=>setForm({...form,test_name:e.target.value})}/></div><div className="f"><label>Referring Doctor</label><input placeholder="Doctor Name" value={form.doctor} onChange={e=>setForm({...form,doctor:e.target.value})}/></div></div>
        <div className="form-row"><div className="f"><label>Date</label><input type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})}/></div><div className="f"><label>Remarks</label><input placeholder="Additional notes" value={form.remarks} onChange={e=>setForm({...form,remarks:e.target.value})}/></div></div>
        <button className="btn btn-p" onClick={save} disabled={saving}>{saving?<><span className="spin"/>&nbsp;Saving...</>:'✅ Save Test Order'}</button>
      </div>}
    </div>
  );
}

/* ─── BILLING ───────────────────────────────────────────────────────────── */
function Billing() {
  const [tab, setTab] = useState('list');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ patient_name:'', ipd_opd_id:'', pay_type:'Cash', tpa:'', room_charges:0, ot_charges:0, lab_charges:0, medicine_charges:0, other_charges:0, total_amount:0, paid_amount:0, status:'Pending', date:today() });

  const load = useCallback(async () => {
    setLoading(true);
    const { data: rows } = await supabase.from('billing').select('*').order('created_at',{ascending:false});
    setData(rows||[]); setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const calcTotal = (f) => Number(f.room_charges||0)+Number(f.ot_charges||0)+Number(f.lab_charges||0)+Number(f.medicine_charges||0)+Number(f.other_charges||0);

  const save = async () => {
    if (!form.patient_name) { alert('Patient Name जरूरी है!'); return; }
    setSaving(true);
    const total = calcTotal(form);
    const due = total - Number(form.paid_amount||0);
    const status = due<=0?'Paid':Number(form.paid_amount)>0?'Partial':'Pending';
    await supabase.from('billing').insert([{ ...form, total_amount:total, due_amount:due, status }]);
    setSaving(false); load(); setTab('list');
  };

  const totalCash = data.filter(x=>x.pay_type==='Cash').reduce((a,x)=>a+Number(x.paid_amount||0),0);
  const totalPending = data.reduce((a,x)=>a+Number(x.due_amount||0),0);

  return (
    <div>
      <div className="sec-hdr"><div className="sec-title">💳 Billing System</div><button className="btn btn-p btn-sm" onClick={()=>setTab('new')}>+ New Bill</button></div>
      <div className="tab-row">{[['list','📋 All Bills'],['new','➕ Create Bill']].map(([t,l])=><div key={t} className={`tab ${tab===t?'active':''}`} onClick={()=>setTab(t)}>{l}</div>)}</div>
      <div className="grid4" style={{marginBottom:12}}>
        <div className="kpi green"><div className="kl">Cash Collected</div><div className="kv">{fmt(totalCash)}</div></div>
        <div className="kpi red"><div className="kl">Total Pending</div><div className="kv">{fmt(totalPending)}</div></div>
        <div className="kpi blue"><div className="kl">Total Bills</div><div className="kv">{data.length}</div></div>
        <div className="kpi orange"><div className="kl">Pending Bills</div><div className="kv">{data.filter(x=>x.status==='Pending'||x.status==='Partial').length}</div></div>
      </div>
      {tab==='list' && <>
        {loading ? <div className="empty-state"><div className="spin" style={{margin:'0 auto'}}/></div> :
        data.length===0 ? <div className="empty-state">कोई Bill नहीं बना। पहला bill बनाएं!</div> :
        <div className="card"><div className="tbl-wrap"><table>
          <thead><tr><th>Bill ID</th><th>Patient</th><th>Type</th><th>Total</th><th>Paid</th><th>Due</th><th>Date</th><th>Status</th></tr></thead>
          <tbody>{data.map(b=>(
            <tr key={b.id}>
              <td style={{color:C.accent,fontSize:11}}>B-{String(b.id).slice(0,6)}</td>
              <td><strong>{b.patient_name}</strong></td>
              <td><span className={`badge ${b.pay_type==='Cash'?'bb':b.pay_type==='Ayushman'?'bg':'bo'}`}>{b.pay_type}</span></td>
              <td>{fmt(b.total_amount)}</td>
              <td style={{color:C.green}}>{fmt(b.paid_amount)}</td>
              <td style={{color:Number(b.due_amount)>0?C.red:C.muted}}>{fmt(b.due_amount)}</td>
              <td style={{fontSize:11,color:C.muted}}>{b.date}</td>
              <td><span className={`badge ${b.status==='Paid'||b.status==='Approved'?'bg':b.status==='Partial'?'bo':b.status==='Pending'?'br':'bm'}`}>{b.status}</span></td>
            </tr>
          ))}</tbody>
        </table></div></div>}
      </>}
      {tab==='new' && <div className="card">
        <div className="card-title">New Bill</div>
        <div className="form-row"><div className="f"><label>Patient Name *</label><input value={form.patient_name} onChange={e=>setForm({...form,patient_name:e.target.value})} placeholder="Patient ka naam"/></div><div className="f"><label>IPD/OPD Reference</label><input value={form.ipd_opd_id} onChange={e=>setForm({...form,ipd_opd_id:e.target.value})} placeholder="ID"/></div></div>
        <div className="form-row3"><div className="f"><label>Payment Type</label><select value={form.pay_type} onChange={e=>setForm({...form,pay_type:e.target.value})}>{PAY_TYPES.map(t=><option key={t}>{t}</option>)}</select></div><div className="f"><label>TPA</label><select value={form.tpa} onChange={e=>setForm({...form,tpa:e.target.value})}><option value="">N/A</option>{TPAS.map(t=><option key={t}>{t}</option>)}</select></div><div className="f"><label>Bill Date</label><input type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})}/></div></div>
        <hr className="divider"/>
        <div className="form-row3">
          <div className="f"><label>Room Charges (₹)</label><input type="number" value={form.room_charges} onChange={e=>setForm({...form,room_charges:e.target.value})}/></div>
          <div className="f"><label>OT/Procedure (₹)</label><input type="number" value={form.ot_charges} onChange={e=>setForm({...form,ot_charges:e.target.value})}/></div>
          <div className="f"><label>Lab/Radiology (₹)</label><input type="number" value={form.lab_charges} onChange={e=>setForm({...form,lab_charges:e.target.value})}/></div>
        </div>
        <div className="form-row3">
          <div className="f"><label>Medicine (₹)</label><input type="number" value={form.medicine_charges} onChange={e=>setForm({...form,medicine_charges:e.target.value})}/></div>
          <div className="f"><label>Other Charges (₹)</label><input type="number" value={form.other_charges} onChange={e=>setForm({...form,other_charges:e.target.value})}/></div>
          <div className="f"><label>Paid Amount (₹)</label><input type="number" value={form.paid_amount} onChange={e=>setForm({...form,paid_amount:e.target.value})}/></div>
        </div>
        <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,padding:'10px 14px',marginBottom:14,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <span style={{color:C.muted}}>Total Amount</span>
          <span style={{fontFamily:'Rajdhani,sans-serif',fontSize:22,fontWeight:700,color:C.accent}}>{fmt(calcTotal(form))}</span>
        </div>
        <button className="btn btn-p" onClick={save} disabled={saving}>{saving?<><span className="spin"/>&nbsp;Saving...</>:'✅ Generate Bill'}</button>
      </div>}
    </div>
  );
}

/* ─── EMPLOYEES ─────────────────────────────────────────────────────────── */
function Employees() {
  const [tab, setTab] = useState('list');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name:'', department:'', role:'', mobile:'', aadhaar:'', salary:0, joining_date:today(), address:'', status:'Active' });
  const [cert, setCert] = useState({ emp_name:'', designation:'', joining:'', leaving:'', cert_type:'Experience Certificate', purpose:'' });

  const load = useCallback(async () => {
    setLoading(true);
    const { data: rows } = await supabase.from('employees').select('*').order('created_at',{ascending:false});
    setData(rows||[]); setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const save = async () => {
    if (!form.name || !form.role || !form.department) { alert('नाम, Department और Role जरूरी है!'); return; }
    setSaving(true);
    await supabase.from('employees').insert([form]);
    setSaving(false); load(); setTab('list');
  };

  const totalSalary = data.reduce((a,e)=>a+Number(e.salary||0),0);

  return (
    <div>
      <div className="sec-hdr"><div className="sec-title">👨‍⚕️ Employee Management</div><button className="btn btn-p btn-sm" onClick={()=>setTab('add')}>+ Add Employee</button></div>
      <div className="tab-row">{[['list','👤 Staff List'],['add','➕ Add Staff'],['salary','💰 Salary'],['certificate','📄 Certificate']].map(([t,l])=><div key={t} className={`tab ${tab===t?'active':''}`} onClick={()=>setTab(t)}>{l}</div>)}</div>

      {tab==='list' && <>
        <div className="stat-row">
          {[['Total',data.length,C.accent],['Active',data.filter(x=>x.status==='Active').length,C.green],['Doctors',data.filter(x=>x.role==='Doctor').length,C.blue],['Salary',fmt(totalSalary),C.purple]].map(([l,v,c])=>(
            <div className="chip" key={l}><div style={{width:7,height:7,borderRadius:2,background:c}}/>{l}: <strong style={{color:c}}>{v}</strong></div>
          ))}
        </div>
        {loading ? <div className="empty-state"><div className="spin" style={{margin:'0 auto'}}/></div> :
        data.length===0 ? <div className="empty-state">कोई Employee नहीं। Staff add करें!</div> :
        <div className="card"><div className="tbl-wrap"><table>
          <thead><tr><th>Emp ID</th><th>Name</th><th>Department</th><th>Role</th><th>Mobile</th><th>Joining</th><th>Salary</th><th>Status</th></tr></thead>
          <tbody>{data.map(e=>(
            <tr key={e.id}>
              <td style={{color:C.accent,fontSize:11}}>E-{String(e.id).slice(0,6)}</td>
              <td><strong>{e.name}</strong></td>
              <td style={{fontSize:11,color:C.muted}}>{e.department}</td>
              <td>{e.role}</td>
              <td style={{fontSize:11}}>{e.mobile}</td>
              <td style={{fontSize:11,color:C.muted}}>{e.joining_date}</td>
              <td style={{color:C.green}}>{fmt(e.salary)}</td>
              <td><span className={`badge ${e.status==='Active'?'bg':'bm'}`}>{e.status}</span></td>
            </tr>
          ))}</tbody>
        </table></div></div>}
      </>}

      {tab==='add' && <div className="card">
        <div className="card-title">Add New Employee</div>
        <div className="form-row"><div className="f"><label>Full Name *</label><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="पूरा नाम"/></div><div className="f"><label>Mobile</label><input value={form.mobile} onChange={e=>setForm({...form,mobile:e.target.value})} placeholder="मोबाइल"/></div></div>
        <div className="form-row3"><div className="f"><label>Department *</label><select value={form.department} onChange={e=>setForm({...form,department:e.target.value})}><option value="">Select...</option>{DEPTS.map(d=><option key={d}>{d}</option>)}<option>Housekeeping</option><option>Administration</option><option>Pharmacy</option><option>Billing</option></select></div><div className="f"><label>Role *</label><select value={form.role} onChange={e=>setForm({...form,role:e.target.value})}><option value="">Select...</option>{ROLES.map(r=><option key={r}>{r}</option>)}</select></div><div className="f"><label>Salary (₹)</label><input type="number" value={form.salary} onChange={e=>setForm({...form,salary:e.target.value})}/></div></div>
        <div className="form-row"><div className="f"><label>Joining Date</label><input type="date" value={form.joining_date} onChange={e=>setForm({...form,joining_date:e.target.value})}/></div><div className="f"><label>Aadhaar</label><input value={form.aadhaar} onChange={e=>setForm({...form,aadhaar:e.target.value})} placeholder="आधार नंबर"/></div></div>
        <div className="f" style={{marginBottom:10}}><label>Address</label><input value={form.address} onChange={e=>setForm({...form,address:e.target.value})} placeholder="पता"/></div>
        <button className="btn btn-p" onClick={save} disabled={saving}>{saving?<><span className="spin"/>&nbsp;Saving...</>:'✅ Add Employee'}</button>
      </div>}

      {tab==='salary' && <div className="card">
        <div className="card-title">Salary Sheet</div>
        {data.length===0 ? <div className="empty-state">कोई Employee नहीं।</div> :
        <div className="tbl-wrap"><table>
          <thead><tr><th>Employee</th><th>Role</th><th>Basic Salary</th><th>Working Days</th><th>Net Payable</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>{data.map(e=>(
            <tr key={e.id}>
              <td><strong>{e.name}</strong><br/><span style={{fontSize:10,color:C.muted}}>{e.department}</span></td>
              <td style={{fontSize:11}}>{e.role}</td>
              <td>{fmt(e.salary)}</td>
              <td style={{color:C.yellow}}>26/30</td>
              <td style={{color:C.green,fontWeight:600}}>{fmt(Math.round(Number(e.salary)*26/30))}</td>
              <td><span className="badge bo">Pending</span></td>
              <td><button className="btn btn-p btn-sm">💰 Pay</button></td>
            </tr>
          ))}</tbody>
        </table></div>}
        <div style={{borderTop:`1px solid ${C.border}`,marginTop:12,paddingTop:10,display:'flex',justifyContent:'space-between'}}>
          <span style={{color:C.muted}}>Total Salary Payable</span>
          <strong style={{color:C.accent,fontSize:16}}>{fmt(data.reduce((a,e)=>a+Math.round(Number(e.salary||0)*26/30),0))}</strong>
        </div>
      </div>}

      {tab==='certificate' && <div className="card">
        <div className="card-title">Experience / NOC Certificate</div>
        <div className="form-row"><div className="f"><label>Employee Name</label><input value={cert.emp_name} onChange={e=>setCert({...cert,emp_name:e.target.value})} placeholder="Employee ka naam"/></div><div className="f"><label>Designation</label><input value={cert.designation} onChange={e=>setCert({...cert,designation:e.target.value})} placeholder="Post/Role"/></div></div>
        <div className="form-row"><div className="f"><label>Joining Date</label><input type="date" value={cert.joining} onChange={e=>setCert({...cert,joining:e.target.value})}/></div><div className="f"><label>Last Working Date</label><input type="date" value={cert.leaving} onChange={e=>setCert({...cert,leaving:e.target.value})}/></div></div>
        <div className="form-row"><div className="f"><label>Certificate Type</label><select value={cert.cert_type} onChange={e=>setCert({...cert,cert_type:e.target.value})}><option>Experience Certificate</option><option>NOC Certificate</option><option>Salary Certificate</option><option>Character Certificate</option></select></div><div className="f"><label>Purpose</label><input value={cert.purpose} onChange={e=>setCert({...cert,purpose:e.target.value})} placeholder="Kis kaam ke liye"/></div></div>
        <button className="btn btn-p" onClick={()=>alert('Certificate generate feature aayega jald hi! Abhi form fill karke print karen.')}>📄 Generate Certificate</button>
      </div>}
    </div>
  );
}

/* ─── CERTIFICATES ──────────────────────────────────────────────────────── */
function Certificates() {
  const [saving, setSaving] = useState(false);
  const [birth, setBirth] = useState({ baby_name:'', dob:today(), time_of_birth:'', mother_name:'', father_name:'', gender:'Male', weight:'', delivery_type:'Normal', doctor:'', ipd_id:'', aadhaar:'', address:'' });
  const [death, setDeath] = useState({ deceased_name:'', dod:today(), time_of_death:'', age:'', gender:'Male', cause:'', doctor:'', ipd_id:'', relative_name:'', relation:'', address:'' });

  const saveBirth = async () => {
    if (!birth.mother_name || !birth.dob) { alert('Mother Name और Date of Birth जरूरी है!'); return; }
    setSaving(true);
    await supabase.from('birth_certificates').insert([birth]);
    setSaving(false); alert('✅ Birth Certificate record saved!');
  };

  const saveDeath = async () => {
    if (!death.deceased_name || !death.dod) { alert('Deceased Name और Date जरूरी है!'); return; }
    setSaving(true);
    await supabase.from('death_certificates').insert([death]);
    setSaving(false); alert('✅ Death Certificate record saved!');
  };

  return (
    <div>
      <div className="sec-hdr"><div className="sec-title">📜 Birth & Death Certificates</div></div>
      <div className="grid2">
        <div className="card">
          <div className="card-title"><span>👶</span> Birth Certificate</div>
          <div className="form-row"><div className="f"><label>Baby Name</label><input value={birth.baby_name} onChange={e=>setBirth({...birth,baby_name:e.target.value})} placeholder="बच्चे का नाम"/></div><div className="f"><label>Date of Birth *</label><input type="date" value={birth.dob} onChange={e=>setBirth({...birth,dob:e.target.value})}/></div></div>
          <div className="form-row3"><div className="f"><label>Time of Birth</label><input type="time" value={birth.time_of_birth} onChange={e=>setBirth({...birth,time_of_birth:e.target.value})}/></div><div className="f"><label>Gender</label><select value={birth.gender} onChange={e=>setBirth({...birth,gender:e.target.value})}><option>Male</option><option>Female</option></select></div><div className="f"><label>Weight (kg)</label><input value={birth.weight} onChange={e=>setBirth({...birth,weight:e.target.value})} placeholder="जन्म वजन"/></div></div>
          <div className="form-row"><div className="f"><label>Mother's Name *</label><input value={birth.mother_name} onChange={e=>setBirth({...birth,mother_name:e.target.value})} placeholder="माँ का नाम"/></div><div className="f"><label>Father's Name</label><input value={birth.father_name} onChange={e=>setBirth({...birth,father_name:e.target.value})} placeholder="पिता का नाम"/></div></div>
          <div className="form-row"><div className="f"><label>Delivery Type</label><select value={birth.delivery_type} onChange={e=>setBirth({...birth,delivery_type:e.target.value})}><option>Normal</option><option>C-Section</option><option>Assisted</option></select></div><div className="f"><label>Doctor</label><input value={birth.doctor} onChange={e=>setBirth({...birth,doctor:e.target.value})} placeholder="Attending Doctor"/></div></div>
          <div className="form-row"><div className="f"><label>IPD No.</label><input value={birth.ipd_id} onChange={e=>setBirth({...birth,ipd_id:e.target.value})} placeholder="IPD Number"/></div><div className="f"><label>Mother's Aadhaar</label><input value={birth.aadhaar} onChange={e=>setBirth({...birth,aadhaar:e.target.value})} placeholder="आधार"/></div></div>
          <div className="f" style={{marginBottom:10}}><label>Address</label><input value={birth.address} onChange={e=>setBirth({...birth,address:e.target.value})} placeholder="घर का पता"/></div>
          <button className="btn btn-p" onClick={saveBirth} disabled={saving}>{saving?<><span className="spin"/>&nbsp;Saving...</>:'📄 Save Birth Record'}</button>
        </div>
        <div className="card">
          <div className="card-title"><span>🕊️</span> Death Certificate</div>
          <div className="form-row"><div className="f"><label>Deceased Name *</label><input value={death.deceased_name} onChange={e=>setDeath({...death,deceased_name:e.target.value})} placeholder="मृतक का नाम"/></div><div className="f"><label>Date of Death *</label><input type="date" value={death.dod} onChange={e=>setDeath({...death,dod:e.target.value})}/></div></div>
          <div className="form-row3"><div className="f"><label>Time</label><input type="time" value={death.time_of_death} onChange={e=>setDeath({...death,time_of_death:e.target.value})}/></div><div className="f"><label>Age</label><input type="number" value={death.age} onChange={e=>setDeath({...death,age:e.target.value})} placeholder="उम्र"/></div><div className="f"><label>Gender</label><select value={death.gender} onChange={e=>setDeath({...death,gender:e.target.value})}><option>Male</option><option>Female</option></select></div></div>
          <div className="form-row"><div className="f"><label>Cause of Death</label><input value={death.cause} onChange={e=>setDeath({...death,cause:e.target.value})} placeholder="मृत्यु का कारण"/></div><div className="f"><label>Doctor</label><input value={death.doctor} onChange={e=>setDeath({...death,doctor:e.target.value})} placeholder="Attending Doctor"/></div></div>
          <div className="form-row"><div className="f"><label>IPD No.</label><input value={death.ipd_id} onChange={e=>setDeath({...death,ipd_id:e.target.value})} placeholder="IPD Number"/></div><div className="f"><label>Relative Name</label><input value={death.relative_name} onChange={e=>setDeath({...death,relative_name:e.target.value})} placeholder="सम्बन्धी"/></div></div>
          <div className="form-row"><div className="f"><label>Relation</label><input value={death.relation} onChange={e=>setDeath({...death,relation:e.target.value})} placeholder="रिश्ता"/></div><div className="f"><label>Address</label><input value={death.address} onChange={e=>setDeath({...death,address:e.target.value})} placeholder="पता"/></div></div>
          <button className="btn btn-p" onClick={saveDeath} disabled={saving}>{saving?<><span className="spin"/>&nbsp;Saving...</>:'📄 Save Death Record'}</button>
        </div>
      </div>
    </div>
  );
}

/* ─── EXPENSES ──────────────────────────────────────────────────────────── */
function Expenses() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ entry_type:'Expense', date:today(), category:'Medicines & Drugs', amount:0, description:'', department:'Hospital-wide', payment_mode:'Cash' });

  const load = useCallback(async () => {
    setLoading(true);
    const { data: rows } = await supabase.from('expenses').select('*').order('created_at',{ascending:false});
    setData(rows||[]); setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const save = async () => {
    if (!form.amount || form.amount<=0) { alert('Amount डालें!'); return; }
    setSaving(true);
    await supabase.from('expenses').insert([form]);
    setSaving(false); load();
  };

  const totalExp = data.filter(x=>x.entry_type==='Expense').reduce((a,x)=>a+Number(x.amount||0),0);
  const totalInc = data.filter(x=>x.entry_type==='Income').reduce((a,x)=>a+Number(x.amount||0),0);

  return (
    <div>
      <div className="sec-hdr"><div className="sec-title">📉 Expenses & Income</div></div>
      <div className="grid4" style={{marginBottom:12}}>
        <div className="kpi red"><div className="kl">Total Expenses</div><div className="kv">{fmt(totalExp)}</div></div>
        <div className="kpi green"><div className="kl">Total Income</div><div className="kv">{fmt(totalInc)}</div></div>
        <div className="kpi blue"><div className="kl">Net Profit</div><div className="kv">{fmt(totalInc-totalExp)}</div></div>
        <div className="kpi orange"><div className="kl">Total Entries</div><div className="kv">{data.length}</div></div>
      </div>
      <div className="grid2">
        <div className="card">
          <div className="card-title">➕ Add Entry</div>
          <div className="form-row"><div className="f"><label>Entry Type</label><select value={form.entry_type} onChange={e=>setForm({...form,entry_type:e.target.value})}><option>Expense</option><option>Income</option></select></div><div className="f"><label>Date</label><input type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})}/></div></div>
          <div className="form-row"><div className="f"><label>Category</label><select value={form.category} onChange={e=>setForm({...form,category:e.target.value})}><option>Medicines & Drugs</option><option>Equipment</option><option>Staff Salary</option><option>Housekeeping</option><option>Electricity</option><option>Lab Consumables</option><option>X-Ray/USG</option><option>OPD Income</option><option>IPD Income</option><option>Other Income</option><option>Miscellaneous</option></select></div><div className="f"><label>Amount (₹)</label><input type="number" value={form.amount} onChange={e=>setForm({...form,amount:e.target.value})}/></div></div>
          <div className="form-row"><div className="f"><label>Department</label><select value={form.department} onChange={e=>setForm({...form,department:e.target.value})}><option>Hospital-wide</option>{DEPTS.map(d=><option key={d}>{d}</option>)}</select></div><div className="f"><label>Payment Mode</label><select value={form.payment_mode} onChange={e=>setForm({...form,payment_mode:e.target.value})}><option>Cash</option><option>Bank Transfer</option><option>Cheque</option><option>UPI</option></select></div></div>
          <div className="f" style={{marginBottom:10}}><label>Description</label><textarea rows={2} value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="Details..."/></div>
          <button className="btn btn-p" onClick={save} disabled={saving}>{saving?<><span className="spin"/>&nbsp;Saving...</>:'✅ Save Entry'}</button>
        </div>
        <div className="card">
          <div className="card-title">📋 Recent Entries</div>
          {loading ? <div className="empty-state"><div className="spin" style={{margin:'0 auto'}}/></div> :
          data.length===0 ? <div className="empty-state">कोई entry नहीं। पहली entry add करें!</div> :
          <div className="tbl-wrap"><table>
            <thead><tr><th>Date</th><th>Type</th><th>Category</th><th>Amount</th><th>Dept</th></tr></thead>
            <tbody>{data.slice(0,20).map(x=>(
              <tr key={x.id}>
                <td style={{fontSize:11,color:C.muted}}>{x.date}</td>
                <td><span className={`badge ${x.entry_type==='Income'?'bg':'br'}`}>{x.entry_type}</span></td>
                <td style={{fontSize:11}}>{x.category}</td>
                <td style={{color:x.entry_type==='Income'?C.green:C.red,fontWeight:600}}>{x.entry_type==='Income'?'+':'-'}{fmt(x.amount)}</td>
                <td style={{fontSize:10,color:C.muted}}>{x.department}</td>
              </tr>
            ))}</tbody>
          </table></div>}
        </div>
      </div>
    </div>
  );
}

/* ─── REPORTS ───────────────────────────────────────────────────────────── */
function Reports({ counts }) {
  return (
    <div>
      <div className="sec-hdr"><div className="sec-title">📊 Reports & Analytics</div></div>
      <div className="grid3" style={{marginBottom:12}}>
        {[['IPD Report','Department, Type, Doctor, Referral wise','blue'],['OPD Report','Daily, Monthly, Department wise','green'],['Revenue Report','Cash / TPA / Ayushman breakup','orange'],['Ayushman Report','Claim-wise status & amount','purple'],['Expense Report','Department-wise hospital expenses','red'],['Employee Report','Attendance, Salary, OT summary','yellow']].map(([t,d,c])=>(
          <div className="card" key={t} style={{cursor:'pointer'}}>
            <div className="card-title">📈 {t}</div>
            <div style={{fontSize:12,color:C.muted,marginBottom:12}}>{d}</div>
            <div className="form-row" style={{marginBottom:8}}><div className="f"><label>From</label><input type="date" defaultValue={today()}/></div><div className="f"><label>To</label><input type="date" defaultValue={today()}/></div></div>
            <button className="btn btn-o btn-sm" style={{width:'100%'}} onClick={()=>alert('Report export feature — coming soon! Abhi dashboard mein live data dekhen.')}>📥 Generate</button>
          </div>
        ))}
      </div>
      <div className="card">
        <div className="card-title">📈 System Summary</div>
        <div className="grid4">
          {[['IPD Patients',counts.ipd,C.accent],['OPD Patients',counts.opd,C.green],['Employees',counts.emp,C.orange],['Lab Records',counts.lab,C.purple]].map(([l,v,c])=>(
            <div key={l} style={{textAlign:'center',padding:'12px 0'}}>
              <div style={{fontFamily:'Rajdhani,sans-serif',fontSize:32,fontWeight:700,color:c}}>{v}</div>
              <div style={{fontSize:11,color:C.muted}}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── NAV CONFIG ─────────────────────────────────────────────────────────── */
const NAV = [
  {group:'Main',items:[{id:'dashboard',icon:'📊',label:'Dashboard'},{id:'opd',icon:'🩺',label:'OPD Registration'},{id:'ipd',icon:'🛏️',label:'IPD Management'}]},
  {group:'Clinical',items:[{id:'beds',icon:'🏥',label:'Bed & Ward Tracking'},{id:'lab',icon:'🧪',label:'Lab / X-Ray / USG'},{id:'certificates',icon:'📜',label:'Birth / Death Cert.'}]},
  {group:'Finance',items:[{id:'billing',icon:'💳',label:'Billing System'},{id:'expenses',icon:'📉',label:'Expenses & Income'}]},
  {group:'Reports & HR',items:[{id:'reports',icon:'📈',label:'Reports & Analytics'},{id:'employees',icon:'👨‍⚕️',label:'Employee & Salary'}]},
];

const PAGE_TITLES = { dashboard:'Dashboard',opd:'OPD Registration',ipd:'IPD Management',beds:'Bed & Ward Tracking',lab:'Lab / X-Ray / USG',billing:'Billing System',employees:'Employee & Salary',reports:'Reports & Analytics',certificates:'Birth & Death Certificates',expenses:'Expenses & Income' };

/* ─── MAIN APP ───────────────────────────────────────────────────────────── */
export default function App() {
  const [session, setSession] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [page, setPage] = useState('dashboard');
  const [collapsed, setCollapsed] = useState(false);
  const [counts, setCounts] = useState({ ipd:0, opd:0, emp:0, lab:0 });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => { setSession(session); setCheckingAuth(false); });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setSession(session));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) return;
    const fetchCounts = async () => {
      const [ipd, opd, emp, lab] = await Promise.all([
        supabase.from('ipd_patients').select('id',{count:'exact',head:true}),
        supabase.from('opd_patients').select('id',{count:'exact',head:true}),
        supabase.from('employees').select('id',{count:'exact',head:true}),
        supabase.from('lab_records').select('id',{count:'exact',head:true}),
      ]);
      setCounts({ ipd:ipd.count||0, opd:opd.count||0, emp:emp.count||0, lab:lab.count||0 });
    };
    fetchCounts();
  }, [session, page]);

  if (checkingAuth) return <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:C.bg}}><div className="spin" style={{width:32,height:32}}/></div>;
  if (!session) return <Login />;

  const renderPage = () => {
    switch(page) {
      case 'dashboard': return <Dashboard counts={counts}/>;
      case 'opd': return <OPD/>;
      case 'ipd': return <IPD/>;
      case 'beds': return <Beds/>;
      case 'lab': return <Lab/>;
      case 'billing': return <Billing/>;
      case 'employees': return <Employees/>;
      case 'reports': return <Reports counts={counts}/>;
      case 'certificates': return <Certificates/>;
      case 'expenses': return <Expenses/>;
      default: return <div className="empty-state">Coming soon...</div>;
    }
  };

  return (
    <>
      <style>{css}</style>
      <div className="app">
        <div className={`sidebar ${collapsed?'collapsed':''}`}>
          <div className="logo-wrap">
            <div className="logo-icon" onClick={()=>setCollapsed(!collapsed)} style={{cursor:'pointer'}}>🏥</div>
            {!collapsed && <div className="logo-text"><div className="logo-name">MEDICARE HMS</div><div className="logo-sub">HOSPITAL SYSTEM</div></div>}
          </div>
          {NAV.map(g=>(
            <div className="nav-group" key={g.group}>
              {!collapsed && <div className="nav-label">{g.group}</div>}
              {g.items.map(item=>(
                <div key={item.id} className={`nav-item ${page===item.id?'active':''}`} onClick={()=>setPage(item.id)} title={item.label}>
                  <span className="nav-icon">{item.icon}</span>
                  {!collapsed && <span>{item.label}</span>}
                </div>
              ))}
            </div>
          ))}
          {!collapsed && <div style={{marginTop:'auto',padding:'12px 16px',borderTop:`1px solid ${C.border}`}}>
            <button className="btn btn-o btn-sm" style={{width:'100%'}} onClick={()=>supabase.auth.signOut()}>🚪 Logout</button>
          </div>}
        </div>
        <div className="main">
          <div className="topbar">
            <div className="topbar-left">
              <button className="btn btn-o btn-sm" onClick={()=>setCollapsed(!collapsed)}>{collapsed?'☰':'✕'}</button>
              <div className="topbar-title">{PAGE_TITLES[page]||'Module'}</div>
            </div>
            <div className="topbar-right">
              <div className="top-chip"><div className="top-dot" style={{background:C.green}}/> Live</div>
              <div className="top-chip" style={{display:'flex',gap:6}}><span style={{color:C.accent}}>{counts.ipd}</span><span style={{color:C.muted}}>IPD</span></div>
              <div className="avatar" title={session?.user?.email}>{(session?.user?.email||'A')[0].toUpperCase()}</div>
            </div>
          </div>
          <div className="content">{renderPage()}</div>
        </div>
      </div>
    </>
  );
}
