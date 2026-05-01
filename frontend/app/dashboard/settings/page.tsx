"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Bell, Lock, User, Palette, CheckCircle, Eye, EyeOff, Moon, Sun } from "lucide-react";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

const TABS = [
  { id:"profile",      label:"Profile",       icon:User },
  { id:"security",     label:"Security",      icon:Lock },
  { id:"notifications",label:"Notifications", icon:Bell },
  { id:"appearance",   label:"Appearance",    icon:Palette },
];

const PWD_CHECKS = [
  { key:"length",  label:"8+ chars",      test:(p:string)=>p.length>=8 },
  { key:"upper",   label:"Uppercase",     test:(p:string)=>/[A-Z]/.test(p) },
  { key:"number",  label:"Number",        test:(p:string)=>/[0-9]/.test(p) },
  { key:"special", label:"Special char",  test:(p:string)=>/[^A-Za-z0-9]/.test(p) },
];

function Toast({msg,type}:{msg:string,type:"success"|"error"}){
  return(
    <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:20}}
      className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl border shadow-xl text-sm font-medium flex items-center gap-2 ${type==="success"?"bg-green-500/20 border-green-500/40 text-green-300":"bg-red-500/20 border-red-500/40 text-red-300"}`}>
      {type==="success"?<CheckCircle size={16}/>:null}{msg}
    </motion.div>
  );
}

export default function SettingsPage(){
  const {user,logout}=useAuth();
  const [tab,setTab]=useState("profile");
  const [toast,setToast]=useState<{msg:string,type:"success"|"error"}|null>(null);

  // Profile state
  const [profile,setProfile]=useState({name:user?.name||"",email:user?.email||""});
  const [savingProfile,setSavingProfile]=useState(false);

  // Security state
  const [pwdForm,setPwdForm]=useState({current:"",newPwd:"",confirm:""});
  const [showPwds,setShowPwds]=useState({current:false,newPwd:false,confirm:false});
  const [savingPwd,setSavingPwd]=useState(false);

  // Notifications
  const [notifs,setNotifs]=useState({taskAssigned:true,taskDue:true,projectUpdates:false,weeklyDigest:true});

  // Appearance
  const [darkMode,setDarkMode]=useState(true);

  useEffect(()=>{
    if(user){setProfile({name:user.name,email:user.email});}
  },[user]);

  const showToast=(msg:string,type:"success"|"error"="success")=>{
    setToast({msg,type});
    setTimeout(()=>setToast(null),3000);
  };

  const handleSaveProfile=async(e:React.FormEvent)=>{
    e.preventDefault();
    setSavingProfile(true);
    try{
      await api.put("/api/auth/me",profile);
      showToast("Profile updated successfully!");
    }catch{showToast("Failed to update profile.","error");}
    finally{setSavingProfile(false);}
  };

  const pwdChecks=PWD_CHECKS.map(c=>({...c,ok:c.test(pwdForm.newPwd)}));

  const handleChangePassword=async(e:React.FormEvent)=>{
    e.preventDefault();
    if(!pwdChecks.every(c=>c.ok)){showToast("New password does not meet requirements.","error");return;}
    if(pwdForm.newPwd!==pwdForm.confirm){showToast("Passwords do not match.","error");return;}
    setSavingPwd(true);
    try{
      await api.put("/api/auth/change-password",{currentPassword:pwdForm.current,newPassword:pwdForm.newPwd});
      setPwdForm({current:"",newPwd:"",confirm:""});
      showToast("Password changed successfully!");
    }catch(err:any){showToast(err.response?.data?.message||"Failed to change password.","error");}
    finally{setSavingPwd(false);}
  };

  const inputCls="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-slate-600 hover:border-white/20 transition-all";

  return(
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-1">Settings</h1>
        <p className="text-slate-400">Manage your account preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar tabs */}
        <div className="space-y-1">
          {TABS.map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium ${tab===t.id?"bg-blue-600/20 text-blue-400":"hover:bg-white/5 text-slate-400 hover:text-white"}`}>
              <t.icon size={18}/>{t.label}
            </button>
          ))}
          <div className="pt-4 border-t border-white/10 mt-4">
            <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-all text-sm font-medium">
              Sign out
            </button>
          </div>
        </div>

        {/* Content panel */}
        <div className="md:col-span-3">
          {/* Profile Tab */}
          {tab==="profile"&&(
            <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className="glass p-6 rounded-2xl">
              <h2 className="text-xl font-semibold mb-6">Profile Information</h2>
              <form onSubmit={handleSaveProfile} className="space-y-5">
                {/* Avatar */}
                <div className="flex items-center gap-5">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                    {profile.name.split(" ").map((n:string)=>n[0]).join("").slice(0,2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">Profile Picture</p>
                    <p className="text-xs text-slate-400">Your initials are used as your avatar.</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full mt-2 inline-block ${user?.role==="Admin"?"bg-purple-500/20 text-purple-400":"bg-blue-500/20 text-blue-400"}`}>{user?.role}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Full Name</label>
                    <input className={inputCls} value={profile.name} onChange={e=>setProfile({...profile,name:e.target.value})} placeholder="Your name"/>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Email Address</label>
                    <input type="email" className={inputCls} value={profile.email} onChange={e=>setProfile({...profile,email:e.target.value})} placeholder="you@company.com"/>
                  </div>
                </div>
                <div className="flex justify-end pt-2 border-t border-white/10">
                  <button type="submit" disabled={savingProfile} className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all disabled:opacity-60">
                    {savingProfile?"Saving...":"Save Changes"}
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* Security Tab */}
          {tab==="security"&&(
            <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className="glass p-6 rounded-2xl">
              <h2 className="text-xl font-semibold mb-6">Change Password</h2>
              <form onSubmit={handleChangePassword} className="space-y-4">
                {["current","newPwd","confirm"].map((field,i)=>(
                  <div key={field}>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">
                      {i===0?"Current Password":i===1?"New Password":"Confirm New Password"}
                    </label>
                    <div className="relative">
                      <input type={showPwds[field as keyof typeof showPwds]?"text":"password"}
                        className={`${inputCls} pr-12`}
                        value={pwdForm[field as keyof typeof pwdForm]}
                        onChange={e=>setPwdForm({...pwdForm,[field]:e.target.value})}
                        placeholder="••••••••"/>
                      <button type="button" onClick={()=>setShowPwds({...showPwds,[field]:!showPwds[field as keyof typeof showPwds]})}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-white transition-colors">
                        {showPwds[field as keyof typeof showPwds]?<EyeOff size={18}/>:<Eye size={18}/>}
                      </button>
                    </div>
                    {field==="newPwd"&&pwdForm.newPwd.length>0&&(
                      <div className="mt-2 grid grid-cols-2 gap-1">
                        {pwdChecks.map(c=>(
                          <div key={c.key} className={`flex items-center gap-1.5 text-xs ${c.ok?"text-green-400":"text-slate-500"}`}>
                            <div className={`w-3 h-3 rounded-full border flex-shrink-0 ${c.ok?"bg-green-500 border-green-500":"border-slate-600"}`}/>
                            {c.label}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                <div className="flex justify-end pt-2 border-t border-white/10">
                  <button type="submit" disabled={savingPwd} className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all disabled:opacity-60">
                    {savingPwd?"Updating...":"Update Password"}
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* Notifications Tab */}
          {tab==="notifications"&&(
            <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className="glass p-6 rounded-2xl">
              <h2 className="text-xl font-semibold mb-6">Notification Preferences</h2>
              <div className="space-y-4">
                {[
                  {key:"taskAssigned",label:"Task assigned to you",desc:"Get notified when a task is assigned to you."},
                  {key:"taskDue",label:"Task due reminders",desc:"Reminders 24 hours before a task is due."},
                  {key:"projectUpdates",label:"Project updates",desc:"When a project you're on is modified."},
                  {key:"weeklyDigest",label:"Weekly digest",desc:"A summary of your week every Monday."},
                ].map(n=>(
                  <div key={n.key} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                    <div>
                      <p className="font-medium text-sm">{n.label}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{n.desc}</p>
                    </div>
                    <button onClick={()=>setNotifs({...notifs,[n.key]:!notifs[n.key as keyof typeof notifs]})}
                      className={`relative w-11 h-6 rounded-full transition-colors ${notifs[n.key as keyof typeof notifs]?"bg-blue-600":"bg-white/10"}`}>
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${notifs[n.key as keyof typeof notifs]?"left-6":"left-1"}`}/>
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex justify-end pt-4 border-t border-white/10 mt-4">
                <button onClick={()=>showToast("Notification preferences saved!")} className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all">Save Preferences</button>
              </div>
            </motion.div>
          )}

          {/* Appearance Tab */}
          {tab==="appearance"&&(
            <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className="glass p-6 rounded-2xl">
              <h2 className="text-xl font-semibold mb-6">Appearance</h2>
              <div className="space-y-4">
                <p className="text-sm text-slate-400">Choose your preferred theme for the workspace.</p>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    {id:true,label:"Dark Mode",icon:Moon,desc:"Easy on the eyes, great for night work."},
                    {id:false,label:"Light Mode",icon:Sun,desc:"Clean and bright for daytime use."},
                  ].map(t=>(
                    <button key={String(t.id)} onClick={()=>{setDarkMode(t.id);showToast(`${t.label} is ${t.id===darkMode?"already active":"coming soon!"}`)}}
                      className={`p-4 rounded-xl border text-left transition-all ${darkMode===t.id?"border-blue-500 bg-blue-500/10":"border-white/10 bg-white/5 hover:bg-white/10"}`}>
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${darkMode===t.id?"bg-blue-500/20 text-blue-400":"bg-white/10 text-slate-400"}`}><t.icon size={20}/></div>
                      <p className="font-medium text-sm">{t.label}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{t.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {toast&&<Toast msg={toast.msg} type={toast.type}/>}
    </div>
  );
}
