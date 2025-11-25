import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, Box, Folder, FileText, CheckCircle, Clock, 
  CreditCard, ChevronRight, ChevronDown, Loader2, LayoutDashboard, 
  AlertTriangle, ArrowRight, XCircle, TrendingUp, Wallet,
  Plus, Link2, Building2, MoreHorizontal, Bot
} from 'lucide-react';

// --- 1. 核心类型定义 (基于 AINativeLayout 扩展) ---

type NodeType = 'briefing' | 'folder' | 'account' | 'draft_account' | 'topup_order' | 'binding_task';

interface NodeData {
  // 通用
  balance?: number;
  platform?: 'TikTok' | 'Google' | 'Meta';
  status?: 'Active' | 'Reviewing' | 'Disabled' | 'Draft';
  // 充值相关
  amount?: number;
  targetAccountIds?: string[]; 
  // 绑定相关
  bindingTarget?: string; // MCC ID
  // 简报相关
  stats?: {
    lowBalanceCount: number;
    bannedCount: number;
    totalSpend: number;
  };
}

interface TreeNode {
  id: string;
  parentId: string | null;
  label: string;
  type: NodeType;
  data?: NodeData;
  children?: TreeNode[];
  isExpanded?: boolean; // 用于控制树的折叠/展开
}

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: number;
  relatedNodeId?: string; // 关联到具体的树节点
}

// --- 2. 初始数据状态 ---

const INITIAL_TREE: TreeNode[] = [
  {
    id: 'node_briefing',
    parentId: null,
    label: "今日智能简报",
    type: 'briefing',
    data: {
      stats: { lowBalanceCount: 2, bannedCount: 0, totalSpend: 12500 }
    }
  },
  {
    id: 'folder_accounts',
    parentId: null,
    label: '广告账户资产',
    type: 'folder',
    isExpanded: true,
    children: [
      { id: 'acc_1', parentId: 'folder_accounts', label: 'Game_US_iOS_01', type: 'account', data: { platform: 'TikTok', balance: 50.00, status: 'Active' } },
      { id: 'acc_2', parentId: 'folder_accounts', label: 'Ecom_EU_Android', type: 'account', data: { platform: 'Meta', balance: 2300.00, status: 'Active' } },
      { id: 'acc_3', parentId: 'folder_accounts', label: 'Brand_Global_03', type: 'account', data: { platform: 'Google', balance: 0.00, status: 'Disabled' } },
    ]
  },
  {
    id: 'folder_orders',
    parentId: null,
    label: '进行中的工单',
    type: 'folder',
    isExpanded: true,
    children: [] // 动态生成
  }
];

// --- 3. 主组件 ---

export default function AssetManagementNative() {
  // 状态管理
  const [treeData, setTreeData] = useState<TreeNode[]>(INITIAL_TREE);
  const [selectedNodeId, setSelectedNodeId] = useState<string>('node_briefing');
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'ai', content: '资产管理模块已就绪。今日有 2 个账户余额不足，您可以查看简报或直接下达指令。', timestamp: Date.now() }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // 滚动到底部
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // --- 4. 核心逻辑：AI 意图处理与树操作 ---

  // 递归查找节点
  const findNode = (nodes: TreeNode[], id: string): TreeNode | undefined => {
    for (const node of nodes) {
      if (node.id === id) return node;
      if (node.children) {
        const found = findNode(node.children, id);
        if (found) return found;
      }
    }
    return undefined;
  };

  // 递归更新树数据
  const updateTree = (nodes: TreeNode[], nodeId: string, updater: (node: TreeNode) => TreeNode): TreeNode[] => {
    return nodes.map(node => {
      if (node.id === nodeId) return updater(node);
      if (node.children) {
        return { ...node, children: updateTree(node.children, nodeId, updater) };
      }
      return node;
    });
  };

  // 插入新节点到指定父节点
  const insertNode = (nodes: TreeNode[], parentId: string, newNode: TreeNode): TreeNode[] => {
    return nodes.map(node => {
      if (node.id === parentId) {
        return { ...node, children: [newNode, ...(node.children || [])], isExpanded: true };
      }
      if (node.children) {
        return { ...node, children: insertNode(node.children, parentId, newNode) };
      }
      return node;
    });
  };

  // LUI 发送处理
  const handleSend = async () => {
    if (!inputValue.trim()) return;
    
    const userText = inputValue;
    setInputValue('');
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', content: userText, timestamp: Date.now() }]);
    setIsProcessing(true);

    // 模拟 AI 思考延迟
    setTimeout(() => {
      processIntent(userText);
      setIsProcessing(false);
    }, 800);
  };

  // 意图识别引擎
  const processIntent = (text: string) => {
    const lowerText = text.toLowerCase();
    let replyContent = '';
    let newNodeId = '';

    // 场景 1: 开户 (Create Account)
    if (lowerText.includes('开户') || lowerText.includes('create')) {
      const platform = lowerText.includes('google') ? 'Google' : lowerText.includes('meta') ? 'Meta' : 'TikTok';
      newNodeId = `draft_${Date.now()}`;
      const newNode: TreeNode = {
        id: newNodeId,
        parentId: 'folder_orders',
        label: `新建 ${platform} 账户`,
        type: 'draft_account',
        data: { platform, status: 'Draft' }
      };
      
      setTreeData(prev => insertNode(prev, 'folder_orders', newNode));
      replyContent = `已为您创建了 ${platform} 开户草稿，请在右侧填写详细信息。`;
    } 
    
    // 场景 2: 充值 (Top up)
    else if (lowerText.includes('充值') || lowerText.includes('加款')) {
      const amountMatch = text.match(/\d+/);
      const amount = amountMatch ? parseInt(amountMatch[0]) : 1000;
      newNodeId = `order_${Date.now()}`;
      
      const newNode: TreeNode = {
        id: newNodeId,
        parentId: 'folder_orders',
        label: `资金充值单 - $${amount}`,
        type: 'topup_order',
        data: { amount, status: 'Reviewing' } // 默认为待确认
      };

      setTreeData(prev => insertNode(prev, 'folder_orders', newNode));
      replyContent = `已生成 $${amount} 的充值工单，请确认充值对象和支付方式。`;
    }

    // 场景 3: 绑定 (Binding)
    else if (lowerText.includes('绑定') || lowerText.includes('bind')) {
      newNodeId = `bind_${Date.now()}`;
      const newNode: TreeNode = {
        id: newNodeId,
        parentId: 'folder_orders',
        label: '商务中心绑定任务',
        type: 'binding_task',
        data: { status: 'Draft' }
      };
      
      setTreeData(prev => insertNode(prev, 'folder_orders', newNode));
      replyContent = '已建立绑定任务，请选择需要关联的账户和商务中心。';
    }

    // 场景 4: 简报 (Briefing)
    else if (lowerText.includes('简报') || lowerText.includes('概览')) {
      newNodeId = 'node_briefing';
      replyContent = '已切换至今日智能简报视图。';
    }

    else {
      replyContent = '未识别指令。您可以尝试：“帮我开户”、“充值 500” 或 “绑定商务中心”。';
    }

    // 更新选中状态和消息
    if (newNodeId) setSelectedNodeId(newNodeId);
    setMessages(prev => [...prev, { 
      id: Date.now().toString(), 
      role: 'ai', 
      content: replyContent, 
      timestamp: Date.now(),
      relatedNodeId: newNodeId 
    }]);
  };

  // --- 5. 组件渲染逻辑 ---

  // 中间栏：递归树渲染组件
  const TreeNodeRenderer = ({ node, level }: { node: TreeNode, level: number }) => {
    const isSelected = selectedNodeId === node.id;
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = node.isExpanded;

    // 图标映射
    const getIcon = () => {
      if (node.type === 'briefing') return <LayoutDashboard className="w-4 h-4 text-purple-500" />;
      if (node.type === 'folder') return <Folder className={`w-4 h-4 ${isSelected ? 'text-indigo-600' : 'text-gray-400'}`} />;
      if (node.type === 'draft_account') return <FileText className="w-4 h-4 text-orange-400" />;
      if (node.type === 'topup_order') return <Wallet className="w-4 h-4 text-green-500" />;
      if (node.type === 'binding_task') return <Link2 className="w-4 h-4 text-blue-500" />;
      if (node.data?.platform === 'TikTok') return <span className="text-xs font-bold text-black">Tk</span>;
      if (node.data?.platform === 'Meta') return <span className="text-xs font-bold text-blue-600">Fb</span>;
      return <Box className="w-4 h-4 text-gray-500" />;
    };

    const handleToggle = (e: React.MouseEvent) => {
      e.stopPropagation();
      setTreeData(prev => updateTree(prev, node.id, n => ({ ...n, isExpanded: !n.isExpanded })));
    };

    const handleSelect = () => {
      setSelectedNodeId(node.id);
    };

    return (
      <div className="select-none">
        <div 
          onClick={handleSelect}
          className={`flex items-center py-2 px-2 cursor-pointer transition-colors text-sm rounded-md mb-0.5
            ${isSelected ? 'bg-white shadow-sm text-indigo-700 font-medium' : 'hover:bg-gray-200/50 text-gray-700'}
          `}
          style={{ paddingLeft: `${level * 12 + 8}px` }}
        >
          {/* 折叠箭头 */}
          <div 
            onClick={hasChildren ? handleToggle : undefined}
            className={`mr-1 p-0.5 rounded hover:bg-gray-300/50 ${hasChildren ? 'visible' : 'invisible'}`}
          >
            {isExpanded ? <ChevronDown className="w-3 h-3 text-gray-400" /> : <ChevronRight className="w-3 h-3 text-gray-400" />}
          </div>

          {/* 节点图标 */}
          <div className="mr-2 flex items-center justify-center w-5 h-5">
            {getIcon()}
          </div>
          
          {/* 节点文本 */}
          <span className="truncate flex-1">{node.label}</span>
        </div>

        {/* 子节点递归 */}
        {hasChildren && isExpanded && (
          <div>
            {node.children!.map(child => (
              <TreeNodeRenderer key={child.id} node={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  // 右侧渲染器：根据 selectedNode 的类型分发视图
  const renderContent = () => {
    const selectedNode = findNode(treeData, selectedNodeId);
    if (!selectedNode) return <div className="p-8 text-gray-400 text-center">请选择左侧对象</div>;

    // 视图 1: 智能简报
    if (selectedNode.type === 'briefing') {
      const { stats } = selectedNode.data || { stats: { lowBalanceCount: 0, bannedCount: 0, totalSpend: 0 }};
      return (
        <div className="p-8 max-w-5xl mx-auto animate-in fade-in duration-300">
          <header className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{selectedNode.label}</h1>
            <p className="text-gray-500 text-sm">数据截止至: {new Date().toLocaleString()}</p>
          </header>

          {/* 风险卡片 */}
          {stats.lowBalanceCount > 0 && (
            <div className="bg-red-50 border border-red-100 rounded-xl p-5 mb-8 flex items-start gap-4">
               <AlertTriangle className="w-6 h-6 text-red-500 shrink-0 mt-1" />
               <div className="flex-1">
                 <h3 className="text-red-900 font-semibold text-lg">资金风险预警</h3>
                 <p className="text-red-700 mt-1">检测到 {stats.lowBalanceCount} 个核心账户余额低于警戒线，可能影响广告投放。</p>
                 <button 
                   onClick={() => processIntent('给余额不足账户充值 1000')}
                   className="mt-4 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
                 >
                   一键补充预算
                 </button>
               </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="text-gray-500 text-sm mb-2">今日总消耗 (Estimated)</div>
              <div className="text-2xl font-bold text-gray-900">${stats.totalSpend.toLocaleString()}</div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="text-gray-500 text-sm mb-2">活跃账户数</div>
              <div className="text-2xl font-bold text-gray-900">12 / 15</div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="text-gray-500 text-sm mb-2">违规/封户风险</div>
              <div className="text-2xl font-bold text-green-600">无风险</div>
            </div>
          </div>
        </div>
      );
    }

    // 视图 2: 开户草稿
    if (selectedNode.type === 'draft_account') {
      return (
        <div className="p-8 max-w-3xl mx-auto animate-in slide-in-from-right-4 duration-300">
          <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{selectedNode.label}</h2>
              <p className="text-gray-500 text-sm mt-1">ID: {selectedNode.id}</p>
            </div>
            <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold">草稿</span>
          </div>
          
          <form className="space-y-6" onSubmit={(e) => {
            e.preventDefault();
            // 模拟提交：将节点移动到 Account 文件夹并激活
            // 实际逻辑会更复杂，这里仅演示 UI 闭环
            processIntent("查看简报"); 
          }}>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">广告平台</label>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-500">{selectedNode.data?.platform}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">账户时区</label>
                <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white">
                  <option>UTC-05:00 (EST)</option>
                  <option>UTC-08:00 (PST)</option>
                  <option>UTC+08:00 (CST)</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">账户名称</label>
                <input type="text" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="例如：Project_Game_US_01" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">推广链接 (Promote URL)</label>
                <input type="text" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="https://" />
              </div>
            </div>
            
            <div className="flex justify-end gap-3 pt-4">
               <button type="button" className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">保存草稿</button>
               <button type="submit" className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium">提交审核</button>
            </div>
          </form>
        </div>
      );
    }

    // 视图 3: 充值工单
    if (selectedNode.type === 'topup_order') {
      return (
        <div className="p-8 max-w-3xl mx-auto animate-in slide-in-from-right-4 duration-300">
          <header className="mb-8 flex items-center gap-3 pb-4 border-b border-gray-100">
             <div className="p-3 bg-green-100 text-green-600 rounded-xl">
               <Wallet className="w-6 h-6" />
             </div>
             <div>
               <h2 className="text-xl font-bold text-gray-900">资金划拨确认</h2>
               <p className="text-gray-500 text-sm">工单号: {selectedNode.id}</p>
             </div>
          </header>

          <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
             <div className="flex justify-between items-center mb-6">
                <span className="text-gray-500">充值金额</span>
                <span className="text-3xl font-bold text-gray-900">${selectedNode.data?.amount}</span>
             </div>
             
             <div className="space-y-4">
               <label className="block text-sm font-medium text-gray-700">目标账户</label>
               {/* 模拟账户选择器 */}
               <div className="border border-gray-200 rounded-lg divide-y divide-gray-100">
                 <div className="p-3 flex items-center justify-between hover:bg-gray-50 cursor-pointer bg-indigo-50/50">
                    <span className="font-medium text-gray-900">Game_US_iOS_01 (TikTok)</span>
                    <CheckCircle className="w-4 h-4 text-indigo-600" />
                 </div>
                 <div className="p-3 flex items-center justify-between hover:bg-gray-50 cursor-pointer">
                    <span className="text-gray-600">Ecom_EU_Android (Meta)</span>
                    <div className="w-4 h-4 border border-gray-300 rounded-full"></div>
                 </div>
               </div>
             </div>
          </div>

          <button className="w-full py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 shadow-lg shadow-green-100 transition-all">
            确认划拨
          </button>
        </div>
      );
    }

    // 视图 4: 绑定任务
    if (selectedNode.type === 'binding_task') {
      return (
        <div className="p-8 max-w-3xl mx-auto animate-in slide-in-from-right-4 duration-300">
          <header className="mb-8 pb-4 border-b border-gray-100">
             <h2 className="text-xl font-bold text-gray-900">商务中心绑定 (BC Binding)</h2>
             <p className="text-gray-500 text-sm mt-1">关联广告账户与媒体商务管理平台</p>
          </header>

          <div className="space-y-6">
             {/* 步骤 1: 选账户 */}
             <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-xs">1</span>
                  选择待绑定账户
                </h3>
                <div className="relative">
                  <select className="w-full p-3 pl-10 border border-gray-300 rounded-lg appearance-none bg-white">
                    <option>Game_US_iOS_01 (TikTok)</option>
                    <option>Ecom_EU_Android (Meta)</option>
                  </select>
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                </div>
             </div>

             {/* 连接线 */}
             <div className="flex justify-center -my-2 relative z-10">
                <Link2 className="w-6 h-6 text-gray-300 rotate-90" />
             </div>

             {/* 步骤 2: 选 BC */}
             <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-xs">2</span>
                  选择商务中心
                </h3>
                <div className="space-y-3">
                   {['Global_Agency_BC_01', 'North_America_Reseller_BM'].map(bc => (
                     <label key={bc} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-indigo-500 cursor-pointer">
                        <input type="radio" name="bc" className="text-indigo-600 focus:ring-indigo-500" />
                        <span className="text-sm font-medium text-gray-700">{bc}</span>
                     </label>
                   ))}
                </div>
             </div>

             <button className="w-full py-3 bg-black text-white font-medium rounded-xl hover:bg-gray-800 transition-all">
               建立绑定关系
             </button>
          </div>
        </div>
      );
    }

    // 默认视图：账户详情
    if (selectedNode.type === 'account') {
      return (
        <div className="p-8 animate-in slide-in-from-right-4 duration-300">
           <div className="mb-6 border-b border-gray-100 pb-4 flex justify-between items-start">
             <div>
               <h2 className="text-xl font-bold flex items-center text-gray-900">
                 {selectedNode.label}
                 {selectedNode.data?.status === 'Active' && <CheckCircle className="w-5 h-5 ml-2 text-green-500"/>}
               </h2>
               <p className="text-sm text-gray-400 mt-1">ID: {selectedNode.id}</p>
             </div>
             <div className="flex gap-2">
               <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                 <MoreHorizontal className="w-5 h-5" />
               </button>
             </div>
           </div>
           
           <div className="grid grid-cols-2 gap-6 mb-8">
             <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <p className="text-gray-500 text-sm mb-2 flex items-center gap-2"><CreditCard className="w-4 h-4"/> 当前余额</p>
                <p className="text-3xl font-bold text-gray-900">${selectedNode.data?.balance?.toFixed(2)}</p>
             </div>
             <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <p className="text-gray-500 text-sm mb-2 flex items-center gap-2"><Building2 className="w-4 h-4"/> 所属平台</p>
                <p className="text-3xl font-bold text-gray-900">{selectedNode.data?.platform}</p>
             </div>
           </div>

           <div className="border-t border-gray-100 pt-6">
             <h3 className="text-sm font-bold text-gray-900 uppercase mb-4">快捷操作</h3>
             <div className="flex gap-3">
               <button 
                 onClick={() => processIntent(`给 ${selectedNode.label} 充值`)}
                 className="px-4 py-2 bg-indigo-50 text-indigo-700 font-medium rounded-lg hover:bg-indigo-100 transition-colors text-sm"
               >
                 充值
               </button>
               <button 
                 onClick={() => processIntent(`绑定 ${selectedNode.label}`)}
                 className="px-4 py-2 bg-gray-50 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors text-sm"
               >
                 商务绑定
               </button>
             </div>
           </div>
        </div>
      );
    }

    return <div className="p-8 text-center text-gray-400">未知节点类型</div>;
  };

  // --- 6. 最终布局渲染 ---
  return (
    <div className="flex h-screen w-full bg-white font-sans text-gray-900 overflow-hidden">
      
      {/* --- 左侧：LUI 控制台 (30%) --- */}
      <div className="w-[30%] min-w-[320px] border-r border-gray-200 flex flex-col bg-gray-50/50 z-20 shadow-lg">
        <div className="p-4 border-b border-gray-200 bg-white flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
             <Bot className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-gray-800">AI Console</span>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl p-3 text-sm leading-relaxed shadow-sm animate-in fade-in slide-in-from-bottom-2
                ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white border border-gray-100 text-gray-700 rounded-bl-none'}
              `}>
                {msg.content}
                {msg.relatedNodeId && (
                  <button 
                    onClick={() => setSelectedNodeId(msg.relatedNodeId!)}
                    className="block mt-2 text-xs opacity-80 hover:opacity-100 underline decoration-dotted"
                  >
                    查看详情 &rarr;
                  </button>
                )}
              </div>
            </div>
          ))}
          {isProcessing && (
            <div className="flex items-center gap-2 text-gray-400 text-xs pl-2">
              <Loader2 className="w-3 h-3 animate-spin" /> 正在处理指令...
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="p-4 bg-white border-t border-gray-200">
          <div className="relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="输入指令 (如: 开户, 充值 500, 简报)..."
              className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
            <button 
              onClick={handleSend}
              className="absolute right-2 top-2 p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* --- 中间：Result Tree (20%) --- */}
      <div className="w-[20%] min-w-[240px] border-r border-gray-200 bg-gray-50 flex flex-col hidden md:flex">
        <div className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-200 flex justify-between items-center">
          工作台对象
          <span className="bg-gray-200 text-gray-500 px-1.5 py-0.5 rounded text-[10px]">{treeData.length + 3} Items</span>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {treeData.map(node => (
            <TreeNodeRenderer key={node.id} node={node} level={0} />
          ))}
        </div>
      </div>

      {/* --- 右侧：GUI 渲染器 (50%) --- */}
      <div className="flex-1 bg-white overflow-y-auto relative">
        {renderContent()}
      </div>

    </div>
  );
}