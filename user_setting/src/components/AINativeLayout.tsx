import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, Box, Folder, FileText, CheckCircle, Clock, 
  CreditCard, ChevronDown, Loader2, LayoutDashboard, 
  AlertTriangle, ArrowRight, XCircle, TrendingUp, Wallet
} from 'lucide-react';

// --- 类型定义 ---
type NodeType = 'briefing' | 'folder' | 'account' | 'draft_account';

interface TreeNode {
  id: string;
  parentId: string | null;
  label: string;
  type: NodeType;
  status?: 'active' | 'draft' | 'pending';
  data?: any;
  children?: TreeNode[];
}

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: number;
}

// --- 模拟初始数据：树的结构 ---
const INITIAL_TREE: TreeNode[] = [
  // 1. 核心变更：简报作为根节点存在
  {
    id: 'node_briefing',
    parentId: null,
    label: "今日简报 (Briefing)",
    type: 'briefing',
    status: 'active'
  },
  // 2. 文件夹结构
  {
    id: 'root_accounts',
    parentId: null,
    label: '广告账户',
    type: 'folder',
    children: [
      { id: 'acc_1', parentId: 'root_accounts', label: 'Google-Summer', type: 'account', status: 'active', data: { platform: 'Google', balance: 500 } },
    ]
  }
];

// --- 组件：智能简报视图 (复用之前的逻辑) ---
const BriefingView = ({ onAction }: { onAction: (action: string) => void }) => {
  return (
    <div className="p-8 animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Morning Briefing</h1>
        <p className="text-gray-500">基于 56 个账户的智能摘要 • 3 项紧急建议</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center text-gray-400 mb-2 text-xs"><Wallet className="w-4 h-4 mr-1"/> 总余额</div>
          <div className="text-2xl font-semibold">$124,500 <span className="text-xs text-green-600 bg-green-50 px-1 rounded">+5%</span></div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
           <div className="flex items-center text-gray-400 mb-2 text-xs"><AlertTriangle className="w-4 h-4 mr-1"/> 风险账户</div>
           <div className="text-2xl font-semibold text-red-600">3</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
           <div className="flex items-center text-gray-400 mb-2 text-xs"><TrendingUp className="w-4 h-4 mr-1"/> 今日消耗</div>
           <div className="text-2xl font-semibold">$8,450</div>
        </div>
      </div>

      {/* Action Feed */}
      <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Action Items</h2>
      <div className="space-y-4">
        {/* Item 1 */}
        <div className="bg-white p-5 rounded-xl border border-red-100 shadow-sm flex items-start group hover:border-red-300 transition-all cursor-pointer" onClick={() => onAction('topup')}>
          <div className="mt-1 mr-4 p-2 rounded-full bg-red-50 text-red-500">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">3 个高消耗账户余额不足</h3>
            <p className="text-gray-600 text-sm mt-1">Game_US_01 等账户预计 2 小时内耗尽预算。</p>
            <div className="mt-3 flex items-center text-indigo-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              点击让 AI 处理充值 <ArrowRight className="w-4 h-4 ml-1"/>
            </div>
          </div>
        </div>

        {/* Item 2 */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-start group hover:border-indigo-300 transition-all">
          <div className="mt-1 mr-4 p-2 rounded-full bg-orange-50 text-orange-500">
             <XCircle className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">Meta 渠道封户率异常</h3>
            <p className="text-gray-600 text-sm mt-1">检测到本月封户数环比增长 40%。</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- 主布局组件 ---
export default function AINativeWorkspace() {
  // State
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'ai', content: '早安。已为你生成今日简报，请查看中间列表的“简报”节点。', timestamp: Date.now() }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [treeData, setTreeData] = useState<TreeNode[]>(INITIAL_TREE);
  const [selectedNodeId, setSelectedNodeId] = useState<string>('node_briefing'); // 默认选中简报
  const [isProcessing, setIsProcessing] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 辅助：递归查找节点
  const findNodeById = (nodes: TreeNode[], id: string): TreeNode | null => {
    for (const node of nodes) {
      if (node.id === id) return node;
      if (node.children) {
        const found = findNodeById(node.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const selectedNode = findNodeById(treeData, selectedNodeId);

  // --- LUI 核心交互逻辑 ---
  const handleSendMessage = (text: string = inputValue) => {
    if (!text.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsProcessing(true);

    // AI 逻辑模拟
    setTimeout(() => {
      let aiContent = '';
      
      // 1. 意图：开户 (Create Workflow)
      if (text.includes('开') && (text.includes('Tiktok') || text.includes('户'))) {
        aiContent = '好的，已新建 Tiktok 开户申请草稿。请在右侧完善信息。';
        
        const newDraftId = `draft_${Date.now()}`;
        const newDraftNode: TreeNode = {
          id: newDraftId,
          parentId: 'root_accounts',
          label: '[草稿] Tiktok账户申请',
          type: 'draft_account',
          status: 'draft',
          data: { platform: 'Tiktok', accountName: '', website: '' }
        };

        setTreeData(prev => {
          const newData = [...prev]; // 浅拷贝
          // 找到 root_accounts 文件夹插入
          const accFolder = newData.find(n => n.id === 'root_accounts');
          if (accFolder) {
            accFolder.children = [newDraftNode, ...(accFolder.children || [])];
          }
          return newData;
        });
        
        // 自动跳转焦点
        setSelectedNodeId(newDraftId);
      } 
      // 2. 意图：充值 (Action Intent)
      else if (text.includes('充值') || text.includes('topup')) {
        aiContent = '明白。已调取充值接口，检测到 Game_US_01 需要补充 $500。确认执行吗？';
        // 这里为了演示，我们暂时不生成新节点，而是就在 LUI 里交互
      }
      // 3. 意图：回看简报
      else if (text.includes('简报') || text.includes('概览')) {
        aiContent = '已切换回今日简报视图。';
        setSelectedNodeId('node_briefing');
      }
      else {
        aiContent = '收到。你可以试着说“我要开一个Tiktok户”或者“查看简报”。';
      }

      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'ai', content: aiContent, timestamp: Date.now() }]);
      setIsProcessing(false);
    }, 800);
  };

  // GUI 内部的交互反哺 LUI
  // 比如：在简报里点击了“充值”，这等同于在对话框里输入了“我要充值”
  const handleBriefingAction = (actionType: string) => {
    if (actionType === 'topup') {
      handleSendMessage("帮我处理那些余额不足的账户，我要充值。");
    }
  };

  const handleFormSubmit = (formData: any) => {
    setIsProcessing(true);
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'ai', content: '正在提交开户申请...', timestamp: Date.now() }]);

    setTimeout(() => {
      setIsProcessing(false);
      setTreeData(prev => {
        const newData = JSON.parse(JSON.stringify(prev));
        const accFolder = newData.find((n: TreeNode) => n.id === 'root_accounts');
        const nodeIndex = accFolder.children.findIndex((n: TreeNode) => n.id === selectedNodeId);
        if (nodeIndex !== -1) {
          accFolder.children[nodeIndex] = {
            ...accFolder.children[nodeIndex],
            label: `Tiktok-${formData.accountName}`,
            type: 'account',
            status: 'active',
            data: { ...formData, balance: 0 }
          };
        }
        return newData;
      });
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'ai', content: '开户成功！', timestamp: Date.now() }]);
    }, 1500);
  };

  return (
    <div className="flex h-screen bg-white text-slate-800 font-sans overflow-hidden">
      
      {/* --- COLUMN 1: LUI (30%) --- */}
      <div className="w-[30%] min-w-[320px] flex flex-col border-r border-gray-200 bg-gray-50">
        <div className="p-4 border-b border-gray-200 bg-white shadow-sm z-10">
          <div className="flex items-center space-x-2 font-bold text-lg text-indigo-600">
            <Box className="w-6 h-6" />
            <span>AI Workspace</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[90%] p-3 rounded-xl text-sm leading-relaxed shadow-sm ${
                msg.role === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
          {isProcessing && <div className="text-xs text-gray-400 ml-2 flex items-center"><Loader2 className="w-3 h-3 animate-spin mr-1"/> AI Thinking...</div>}
          <div ref={chatEndRef} />
        </div>

        <div className="p-4 bg-white border-t border-gray-200">
          <div className="relative">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); }}}
              placeholder="Ask anything..."
              className="w-full pl-4 pr-12 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 text-sm resize-none"
              rows={3}
            />
            <button onClick={() => handleSendMessage()} className="absolute right-3 bottom-3 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* --- COLUMN 2: RESULT TREE (20%) --- */}
      <div className="w-[20%] min-w-[240px] flex flex-col border-r border-gray-200 bg-slate-50/50">
        <div className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Explorer</div>
        <div className="flex-1 overflow-y-auto p-2">
          
          {/* Tree Rendering */}
          {treeData.map((node) => (
            <div key={node.id} className="mb-1">
              {/* 如果是根节点类型 (如 Briefing)，直接渲染 */}
              {node.type === 'briefing' ? (
                <div 
                  onClick={() => setSelectedNodeId(node.id)}
                  className={`flex items-center px-3 py-2 rounded-md text-sm cursor-pointer mb-4 transition-all ${
                    selectedNodeId === node.id ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  {node.label}
                </div>
              ) : (
                /* 如果是文件夹 */
                <div className="mb-2">
                  <div className="flex items-center px-2 py-1 text-xs font-semibold text-gray-500 mb-1">
                    <ChevronDown className="w-3 h-3 mr-1" />
                    {node.type === 'folder' && <Folder className="w-3 h-3 mr-2" />}
                    {node.label}
                  </div>
                  <div className="pl-4 space-y-1">
                    {node.children?.map((child) => (
                      <div 
                        key={child.id}
                        onClick={() => setSelectedNodeId(child.id)}
                        className={`group flex items-center px-3 py-2 rounded-md text-sm cursor-pointer transition-all ${
                          selectedNodeId === child.id ? 'bg-white shadow-sm border border-gray-200 text-indigo-700 font-medium' : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {child.type === 'draft_account' ? <Clock className="w-4 h-4 mr-2 text-orange-500" /> : <CheckCircle className="w-4 h-4 mr-2 text-green-500" />}
                        <span className="truncate">{child.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

        </div>
      </div>

      {/* --- COLUMN 3: GUI RENDERER (50%) --- */}
      <div className="flex-1 bg-white flex flex-col min-w-[400px]">
        {/* 根据 selectedNode 的类型，动态决定渲染什么 */}
        
        {/* 1. 渲染简报 */}
        {selectedNode?.type === 'briefing' && (
           <BriefingView onAction={handleBriefingAction} />
        )}

        {/* 2. 渲染草稿表单 */}
        {selectedNode?.type === 'draft_account' && (
          <div className="p-8 max-w-2xl mx-auto w-full animate-in slide-in-from-right-4 duration-300">
             <div className="mb-6 border-b border-gray-100 pb-4">
               <h2 className="text-xl font-bold flex items-center"><FileText className="w-5 h-5 mr-2 text-orange-500"/> {selectedNode.label}</h2>
             </div>
             <form onSubmit={(e) => { e.preventDefault(); handleFormSubmit({ accountName: 'Summer2025' }); }}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">平台</label>
                    <input type="text" value="Tiktok" disabled className="w-full p-2 bg-gray-100 rounded border border-gray-200 text-gray-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">账户名称</label>
                    <input type="text" defaultValue="Tiktok-Promo" className="w-full p-2 rounded border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none" />
                  </div>
                  <button type="submit" className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">提交申请</button>
                </div>
             </form>
          </div>
        )}

        {/* 3. 渲染账户详情 */}
        {selectedNode?.type === 'account' && (
          <div className="p-8 animate-in slide-in-from-right-4 duration-300">
             <div className="mb-6 border-b border-gray-100 pb-4">
               <h2 className="text-xl font-bold flex items-center"><CheckCircle className="w-5 h-5 mr-2 text-green-500"/> {selectedNode.label}</h2>
               <p className="text-sm text-gray-400 mt-1">ID: {selectedNode.data?.id || 'Unknown'}</p>
             </div>
             <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 text-center">
                <p className="text-gray-500 mb-2">当前余额</p>
                <p className="text-3xl font-bold text-gray-800">${selectedNode.data?.balance || 0}</p>
             </div>
          </div>
        )}

        {!selectedNode && (
          <div className="flex-1 flex items-center justify-center text-gray-300">
            Select an item from the explorer
          </div>
        )}
      </div>
    </div>
  );
}