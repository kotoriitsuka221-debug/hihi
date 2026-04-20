/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { BookOpen, Calculator, MessageCircle, Home, Search, Book, GraduationCap, ChevronRight, Send, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FORMULAS, EXERCISES } from './data';
import { Formula, Exercise } from './types';
import { askGemini } from './services/gemini';

// --- Components ---

const Navbar = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (t: string) => void }) => {
  const tabs = [
    { id: 'home', label: 'Dashboard', icon: Home },
    { id: 'formulas', label: 'Thư viện', icon: BookOpen },
    { id: 'exercises', label: 'Tập trung', icon: Calculator },
    { id: 'chat', label: 'Trợ lý AI', icon: MessageCircle },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-zinc-200 z-50 md:sticky md:top-0 md:bg-white md:border-b">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex justify-between items-center h-14 md:h-16">
          <div className="hidden md:flex items-center gap-2 mr-12 cursor-pointer" onClick={() => setActiveTab('home')}>
             <div className="w-8 h-8 bg-emerald-600 rounded-sm flex items-center justify-center text-white font-black text-lg">A</div>
             <span className="font-black tracking-tighter text-2xl uppercase">Acc_Master</span>
          </div>
          
          <div className="flex flex-1 justify-around md:justify-start md:gap-10">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex flex-col md:flex-row items-center gap-1 md:gap-2 transition-all relative py-1 md:py-2 ${
                    isActive 
                      ? 'text-emerald-600' 
                      : 'text-zinc-400 hover:text-zinc-900'
                  }`}
                >
                  <span className={`text-[10px] md:text-xs font-black uppercase tracking-widest ${isActive ? 'opacity-100' : 'opacity-80'}`}>
                    {tab.label}
                  </span>
                  {isActive && (
                    <motion.div 
                      layoutId="navUnderline"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-emerald-600"
                    />
                  )}
                </button>
              );
            })}
          </div>

          <div className="hidden md:block">
             <div className="w-10 h-10 rounded-full bg-zinc-100 border border-zinc-200" />
          </div>
        </div>
      </div>
    </nav>
  );
};

const FormulaCard = ({ formula }: { formula: Formula, key?: string }) => {
  return (
    <motion.div 
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="group bg-white border border-zinc-200 p-6 hover:border-emerald-600 transition-all cursor-pointer relative overflow-hidden"
    >
      <div className="flex justify-between items-start mb-4">
        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">
          {formula.category}
        </span>
        <div className="w-8 h-8 border border-zinc-100 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
          <ChevronRight size={16} />
        </div>
      </div>
      <h3 className="text-xl font-bold text-zinc-900 mb-2 leading-tight">
        {formula.name}
      </h3>
      <div className="font-mono text-zinc-900 text-sm mb-4 py-2 border-b border-zinc-100">
        {formula.equation}
      </div>
      <p className="text-zinc-500 text-xs font-medium leading-relaxed">
        {formula.description}
      </p>
    </motion.div>
  );
};

const ExerciseCard = ({ exercise }: { exercise: Exercise, key?: string }) => {
  const [answer, setAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const isCorrect = parseFloat(answer) === exercise.correctAnswer;

  return (
    <motion.div 
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white border border-zinc-200 p-8"
    >
      <div className="flex justify-between items-center mb-6">
        <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 border ${
          exercise.difficulty === 'Dễ' ? 'border-emerald-200 text-emerald-600 bg-emerald-50' :
          exercise.difficulty === 'Khó' ? 'border-red-200 text-red-600 bg-red-50' : 'border-zinc-200 text-zinc-500'
        }`}>
          {exercise.difficulty}
        </span>
        <span className="text-[10px] text-zinc-400 font-black uppercase tracking-[0.2em]">{exercise.category}</span>
      </div>
      
      <h4 className="text-xl font-black mb-6 uppercase leading-tight">{exercise.title}</h4>
      
      <div className="bg-zinc-50 p-6 border-l-4 border-zinc-900 mb-8 font-medium text-zinc-700 italic">
        "{exercise.question}"
      </div>
      
      {!showResult ? (
        <div className="space-y-4">
          <div className="relative">
            <input 
              type="number" 
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Đáp số của bạn"
              className="w-full bg-zinc-50 border-2 border-zinc-200 px-4 py-4 focus:border-emerald-600 outline-none transition-all font-black text-lg pr-20"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 font-bold">
              {exercise.unit}
            </span>
          </div>
          <button 
            disabled={!answer}
            onClick={() => setShowResult(true)}
            className="w-full bg-zinc-900 text-white py-4 font-black uppercase tracking-[0.2em] hover:bg-emerald-600 transition-colors disabled:opacity-30"
          >
            Nộp bài giải
          </button>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`p-6 border-2 ${isCorrect ? 'border-emerald-600 bg-emerald-50' : 'border-red-600 bg-red-50'}`}
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="font-black uppercase tracking-widest text-lg">
              {isCorrect ? 'Đạt' : 'Chưa đạt'}
            </span>
          </div>
          <p className="text-zinc-600 mb-6 font-medium">
            <span className="font-black text-zinc-900">Đáp án:</span> {exercise.correctAnswer} {exercise.unit}
          </p>
          <div className="text-zinc-800 text-sm border-t border-zinc-200 pt-4 leading-relaxed">
            <span className="font-black block uppercase mb-1 text-[10px] tracking-widest opacity-60">Lời giải</span>
            {exercise.explanation}
          </div>
          <button 
            onClick={() => { setShowResult(false); setAnswer(''); }}
            className="mt-6 text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-900 transition-colors underline underline-offset-4"
          >
            Thử lại lần nữa
          </button>
        </motion.div>
      )}
    </motion.div>
  );
};

const ChatView = () => {
  const [messages, setMessages] = useState<{ role: 'user' | 'model', text: string }[]>([
    { role: 'model', text: 'Chào bạn! Mình là Trợ lý AI Kế toán. Bạn có thắc mắc gì về định khoản, thuế hay các phương pháp hạch toán không?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    const response = await askGemini(userMsg, messages.map(m => ({ role: m.role, parts: [{ text: m.text }] })));
    setMessages(prev => [...prev, { role: 'model', text: response }]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-160px)] md:h-[calc(100vh-100px)] bg-zinc-100">
      <div className="p-6 border-b border-zinc-200 bg-white">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
          <h3 className="font-black uppercase tracking-widest text-sm">Trợ lý AI Kế toán</h3>
        </div>
        <p className="text-[10px] text-zinc-400 mt-1 uppercase font-bold">Sẵn sàng giải đáp 24/7</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[90%] md:max-w-[75%] p-5 border ${
              m.role === 'user' 
                ? 'bg-emerald-50 border-emerald-100 text-emerald-900 rounded-bl-3xl' 
                : 'bg-white border-zinc-200 text-zinc-800 rounded-br-3xl'
            }`}>
              {m.role === 'model' && <p className="text-[10px] font-black uppercase tracking-widest mb-2 opacity-40">AI Brain</p>}
              <p className={`text-sm leading-relaxed ${m.role === 'model' ? 'italic' : 'font-medium'}`}>{m.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white p-5 border border-zinc-200 rounded-br-3xl flex gap-1">
              <span className="w-1.5 h-1.5 bg-zinc-200 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-zinc-200 rounded-full animate-bounce [animation-delay:0.1s]"></span>
              <span className="w-1.5 h-1.5 bg-zinc-200 rounded-full animate-bounce [animation-delay:0.2s]"></span>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 bg-white border-t border-zinc-200">
        <div className="relative">
          <textarea 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }}}
            placeholder="Hỏi về định khoản, thuế, công thức..."
            className="w-full bg-zinc-50 border-2 border-zinc-200 p-4 text-sm focus:border-emerald-600 outline-none resize-none h-24 font-medium"
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="absolute bottom-3 right-3 bg-zinc-900 text-white px-6 py-2 text-xs font-black uppercase tracking-widest hover:bg-emerald-600 transition-colors disabled:opacity-20"
          >
            Gửi
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Page Views ---

const HomeView = ({ onNavigate }: { onNavigate: (t: string) => void, key?: string }) => {
  return (
    <div className="space-y-12 py-8 animate-in fade-in slide-in-from-bottom-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div 
          onClick={() => onNavigate('formulas')}
          className="bg-emerald-600 p-10 text-white relative overflow-hidden group cursor-pointer"
        >
          <span className="text-[160px] font-black absolute -right-8 -bottom-12 opacity-10 group-hover:scale-110 transition-transform duration-500">80</span>
          <p className="text-xs font-black uppercase tracking-[0.3em] opacity-70 mb-2">Thư viện tài liệu</p>
          <h2 className="text-5xl font-black uppercase leading-[0.9]">Công thức<br />Kế toán</h2>
          <div className="mt-8 flex items-center gap-4">
             <div className="h-1 flex-1 bg-white/20">
                <div className="h-full w-3/4 bg-white"></div>
             </div>
             <span className="text-xs font-bold uppercase tracking-widest">60 Đã thuộc</span>
          </div>
          <div className="mt-8 flex items-center gap-2 font-black uppercase text-xs tracking-widest group-hover:gap-4 transition-all">
             Bắt đầu ôn tập <ArrowRight size={16} />
          </div>
        </div>

        <div 
          onClick={() => onNavigate('exercises')}
          className="bg-zinc-900 p-10 text-white relative overflow-hidden group cursor-pointer"
        >
          <span className="text-[160px] font-black absolute -right-8 -bottom-12 opacity-10 group-hover:scale-110 transition-transform duration-500">82</span>
          <p className="text-xs font-black uppercase tracking-[0.3em] opacity-70 mb-2">Trung tâm luyện tập</p>
          <h2 className="text-5xl font-black uppercase leading-[0.9]">Bài tập<br />Thực hành</h2>
          <div className="mt-8 flex items-center gap-4">
             <div className="h-1 flex-1 bg-zinc-800">
                <div className="h-full w-1/4 bg-emerald-500"></div>
             </div>
             <span className="text-xs font-bold uppercase tracking-widest">22 Hoàn thành</span>
          </div>
          <div className="mt-8 flex items-center gap-2 font-black uppercase text-xs tracking-widest group-hover:gap-4 transition-all">
             Vào luyện đề <ArrowRight size={16} />
          </div>
        </div>
      </div>

      <div className="border-t border-zinc-200 pt-12">
         <div className="flex justify-between items-end mb-8">
            <div>
               <h3 className="text-xs font-black uppercase tracking-[0.4em] text-zinc-400 mb-2">Lộ trình học tập</h3>
               <p className="text-2xl font-black uppercase">Đang tiến hành: Chương 2 - Báo cáo tài chính</p>
            </div>
            <button 
              onClick={() => onNavigate('chat')}
              className="px-6 py-3 border-2 border-zinc-900 font-black uppercase text-xs tracking-widest hover:bg-zinc-900 hover:text-white transition-all"
            >
              Cần AI hỗ trợ?
            </button>
         </div>
         
         <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-zinc-200">
            {FORMULAS.slice(0, 3).map((f) => (
               <div key={f.id} className="p-8 border-b md:border-b-0 md:border-r border-zinc-200 last:border-0 hover:bg-zinc-100 transition-colors cursor-pointer group">
                  <span className="text-[10px] font-black text-emerald-600 uppercase mb-2 block tracking-widest">{f.id}</span>
                  <h4 className="text-lg font-bold mb-2 group-hover:translate-x-2 transition-transform">{f.name} →</h4>
                  <p className="text-xs text-zinc-400 font-mono">{f.equation}</p>
               </div>
            ))}
         </div>
      </div>
    </div>
  );
};

const FormulasView = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Tất cả');
  const categories = ['Tất cả', ...new Set(FORMULAS.map(f => f.category))];
  
  const filtered = FORMULAS.filter(f => 
    (category === 'Tất cả' || f.category === category) &&
    (f.name.toLowerCase().includes(search.toLowerCase()) || f.equation.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-10 py-6">
      <div className="flex flex-col md:flex-row gap-8 items-end justify-between border-b-4 border-zinc-900 pb-8">
        <div>
           <h2 className="text-6xl font-black uppercase leading-none tracking-tighter">Thư viện<br />Kiến thức</h2>
           <p className="text-zinc-500 mt-4 font-bold uppercase tracking-widest text-[10px]">80 Công thức kế toán Việt Nam</p>
        </div>
        <div className="flex w-full md:w-auto gap-4">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
            <input 
              type="text" 
              placeholder="Tên công thức..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border-2 border-zinc-200 pl-12 pr-4 py-3 outline-none focus:border-emerald-600 font-bold"
            />
          </div>
          <select 
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-white border-2 border-zinc-200 px-6 py-3 outline-none focus:border-emerald-600 font-black uppercase text-xs tracking-widest"
          >
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-zinc-200 border border-zinc-200">
        <AnimatePresence mode='popLayout'>
          {filtered.map(f => <FormulaCard key={f.id} formula={f} />)}
        </AnimatePresence>
      </div>
    </div>
  );
};

const ExercisesView = () => {
  const [filter, setFilter] = useState('Tất cả');
  const difficulties = ['Tất cả', 'Dễ', 'Trung bình', 'Khó'];
  const filtered = EXERCISES.filter(e => filter === 'Tất cả' || e.difficulty === filter);

  return (
    <div className="space-y-10 py-6">
       <div className="flex flex-col md:flex-row gap-8 items-end justify-between border-b-4 border-zinc-900 pb-8">
        <div>
           <h2 className="text-6xl font-black uppercase leading-none tracking-tighter">Luyện tập<br />Thực tế</h2>
           <p className="text-zinc-500 mt-4 font-bold uppercase tracking-widest text-[10px]">82 Bài tập nghiệp vụ thực hành</p>
        </div>
        <div className="flex space-x-2">
          {difficulties.map(d => (
            <button
              key={d}
              onClick={() => setFilter(d)}
              className={`px-6 py-3 font-black uppercase text-[10px] tracking-widest transition-all border-2 ${
                filter === d ? 'bg-zinc-900 text-white border-zinc-900' : 'bg-transparent text-zinc-400 border-zinc-200 hover:border-zinc-900'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-zinc-200 border border-zinc-200 mb-20">
        <AnimatePresence mode='popLayout'>
          {filtered.map(e => <ExerciseCard key={e.id} exercise={e} />)}
        </AnimatePresence>
      </div>
    </div>
  );
};

// --- Main Root App ---

export default function App() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans selection:bg-emerald-100 selection:text-emerald-900 flex flex-col">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 pb-20 pt-8">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && <HomeView key="home" onNavigate={setActiveTab} />}
          {activeTab === 'formulas' && <FormulasView key="formulas" />}
          {activeTab === 'exercises' && <ExercisesView key="exercises" />}
          {activeTab === 'chat' && <ChatView key="chat" />}
        </AnimatePresence>
      </main>

      <footer className="bg-zinc-900 text-white py-4 px-8 hidden md:block border-t border-zinc-800">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-[10px] font-black tracking-[0.3em] uppercase opacity-40">
           <div className="flex gap-8">
             <span>© 2026 ACC_MASTER SYSTEM</span>
             <span>PHIÊN BẢN 2.0.4 - INDUSTRIAL EDIT</span>
           </div>
           <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
              <span>Dữ liệu đã được đồng bộ hóa</span>
           </div>
        </div>
      </footer>
    </div>
  );
}



