"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Lock, Mail, Eye, EyeOff, User, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const PWD_CHECKS = [
  { key:"length",  label:"8+ chars",        test:(p:string)=>p.length>=8 },
  { key:"upper",   label:"Uppercase letter", test:(p:string)=>/[A-Z]/.test(p) },
  { key:"number",  label:"Number (0-9)",     test:(p:string)=>/[0-9]/.test(p) },
  { key:"special", label:"Special (@#!…)",   test:(p:string)=>/[^A-Za-z0-9]/.test(p) },
];

function strengthLabel(okCount:number){ if(okCount<=1)return{label:"Weak",color:"bg-red-500",w:"w-1/4"}; if(okCount===2)return{label:"Fair",color:"bg-orange-500",w:"w-2/4"}; if(okCount===3)return{label:"Good",color:"bg-yellow-500",w:"w-3/4"}; return{label:"Strong",color:"bg-green-500",w:"w-full"}; }

export default function Register() {
  const [form,setForm]=useState({name:"",email:"",password:""});
  const [showPwd,setShowPwd]=useState(false);
  const [loading,setLoading]=useState(false);
  const [errorMsg,setErrorMsg]=useState("");
  const {register}=useAuth();

  const checks=PWD_CHECKS.map(c=>({...c,ok:c.test(form.password)}));
  const okCount=checks.filter(c=>c.ok).length;
  const strength=strengthLabel(okCount);
  const allOk=okCount===4;

  const handleSubmit=async(e:React.FormEvent)=>{
    e.preventDefault();
    if(!allOk){setErrorMsg("Password must meet all requirements.");return;}
    setLoading(true);setErrorMsg("");
    try{await register(form.name,form.email,form.password);}
    catch(err:any){setErrorMsg(err.response?.data?.message||"Registration failed.");}
    finally{setLoading(false);}
  };

  return(
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#0a0f1e] relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[120px]"/>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/10 blur-[120px]"/>

      <Link href="/" className="absolute top-8 left-8 text-2xl font-bold tracking-tighter z-50">FLOW<span className="text-blue-400">FORGE</span></Link>

      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.5}} className="w-full max-w-md glass p-8 rounded-3xl relative z-10 mt-12">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold mb-1">Create your account</h1>
          <p className="text-slate-400">Join your team and start flowing seamlessly.</p>
        </div>

        {errorMsg&&<motion.div initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">{errorMsg}</motion.div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Full Name</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-400 transition-colors"><User size={18}/></div>
              <input type="text" required value={form.name} onChange={e=>setForm({...form,name:e.target.value})}
                className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-slate-600 hover:border-white/20 transition-all"
                placeholder="John Doe"/>
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Email Address</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-400 transition-colors"><Mail size={18}/></div>
              <input type="email" required value={form.email} onChange={e=>setForm({...form,email:e.target.value})}
                className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-slate-600 hover:border-white/20 transition-all"
                placeholder="you@company.com"/>
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-400 transition-colors"><Lock size={18}/></div>
              <input type={showPwd?"text":"password"} required value={form.password} onChange={e=>setForm({...form,password:e.target.value})}
                className="w-full pl-11 pr-12 py-3.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-slate-600 hover:border-white/20 transition-all"
                placeholder="Create a strong password"/>
              <button type="button" onClick={()=>setShowPwd(!showPwd)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-white transition-colors">
                {showPwd?<EyeOff size={18}/>:<Eye size={18}/>}
              </button>
            </div>

            {form.password.length>0&&(
              <motion.div initial={{opacity:0}} animate={{opacity:1}} className="mt-3 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-500 ${strength.color} ${strength.w}`}/>
                  </div>
                  <span className="text-xs text-slate-400">{strength.label}</span>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  {checks.map(c=>(
                    <div key={c.key} className={`flex items-center gap-1.5 text-xs transition-colors ${c.ok?"text-green-400":"text-slate-500"}`}>
                      <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center flex-shrink-0 ${c.ok?"bg-green-500 border-green-500":"border-slate-600"}`}>
                        {c.ok&&<CheckCircle2 size={9} className="text-white"/>}
                      </div>
                      {c.label}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          <button type="submit" disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-60 shadow-[0_0_30px_rgba(59,130,246,0.3)]">
            {loading
              ?<><svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Creating account...</>
              :<>Sign Up <ArrowRight size={18}/></>}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}
