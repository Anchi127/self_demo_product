import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, Box, Folder, FileText, CheckCircle, Clock, 
  ChevronDown, ChevronRight, Loader2, LayoutDashboard, 
  AlertTriangle, ArrowRight, XCircle, TrendingUp, Wallet,
  Link2, Building2, MoreHorizontal, Bot, Search
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent } from './ui/card';
import { cn } from '../lib/utils';

// --- 类型定义 ---
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

// --- 模拟初始数据：树的结构 ---
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

// --- 主布局组件 ---
export function AssetsPage() {
  // State
  const [treeData, setTreeData] = useState<TreeNode[]>(INITIAL_TREE);
  const [selectedNodeId, setSelectedNodeId] = useState<string>('node_briefing');
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'ai', content: '资产管理模块已就绪。今日有 2 个账户余额不足，您可以查看简报或直接下达指令。', timestamp: Date.now() }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // --- 核心逻辑：AI 意图处理与树操作 ---

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
      replyContent = '未识别指令。您可以尝试："帮我开户"、"充值 500" 或 "绑定商务中心"。';
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

  // --- 组件渲染逻辑 ---

  // 中间栏：递归树渲染组件
  const TreeNodeRenderer = ({ node, level }: { node: TreeNode, level: number }) => {
    const isSelected = selectedNodeId === node.id;
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = node.isExpanded ?? false;

    // 图标映射
    const getIcon = () => {
      if (node.type === 'briefing') return <LayoutDashboard className="w-4 h-4 text-purple-500" />;
      if (node.type === 'folder') return <Folder className={cn("w-4 h-4", isSelected ? 'text-primary' : 'text-muted-foreground')} />;
      if (node.type === 'draft_account') return <FileText className="w-4 h-4 text-orange-400" />;
      if (node.type === 'topup_order') return <Wallet className="w-4 h-4 text-green-500" />;
      if (node.type === 'binding_task') return <Link2 className="w-4 h-4 text-blue-500" />;
      if (node.data?.platform === 'TikTok') return <span className="text-xs font-bold text-foreground">Tk</span>;
      if (node.data?.platform === 'Meta') return <span className="text-xs font-bold text-blue-600">Fb</span>;
      return <Box className="w-4 h-4 text-muted-foreground" />;
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
          className={cn(
            "flex items-center py-2 px-2 cursor-pointer transition-colors text-sm rounded-md mb-0.5",
            isSelected 
              ? 'bg-card shadow-sm border border-border text-primary font-medium' 
              : 'hover:bg-secondary/50 text-foreground'
          )}
          style={{ paddingLeft: `${level * 12 + 8}px` }}
        >
          {/* 折叠箭头 */}
          <div 
            onClick={hasChildren ? handleToggle : undefined}
            className={cn(
              "mr-1 p-0.5 rounded hover:bg-secondary/50",
              hasChildren ? 'visible cursor-pointer' : 'invisible'
            )}
          >
            {isExpanded ? (
              <ChevronDown className="w-3 h-3 text-muted-foreground" />
            ) : (
              <ChevronRight className="w-3 h-3 text-muted-foreground" />
            )}
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
    if (!selectedNode) return <div className="p-8 text-muted-foreground text-center">请选择左侧对象</div>;

    // 视图 1: 智能简报
    if (selectedNode.type === 'briefing') {
      const { stats } = selectedNode.data || { stats: { lowBalanceCount: 0, bannedCount: 0, totalSpend: 0 }};
      return (
        <div className="p-8 max-w-5xl mx-auto">
          <header className="mb-8">
            <h1 className="text-2xl font-semibold text-foreground mb-2">{selectedNode.label}</h1>
            <p className="text-muted-foreground text-sm">数据截止至: {new Date().toLocaleString()}</p>
          </header>

          {/* 风险卡片 */}
          {stats.lowBalanceCount > 0 && (
            <Card className="mb-8 border-destructive/50">
              <CardContent className="p-5 flex items-start gap-4">
                <AlertTriangle className="w-6 h-6 text-destructive shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="text-destructive font-semibold text-lg">资金风险预警</h3>
                  <p className="text-muted-foreground mt-1">检测到 {stats.lowBalanceCount} 个核心账户余额低于警戒线，可能影响广告投放。</p>
                  <Button 
                    onClick={() => processIntent('给余额不足账户充值 1000')}
                    variant="destructive"
                    className="mt-4"
                  >
                    一键补充预算
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="text-muted-foreground text-sm mb-2">今日总消耗 (Estimated)</div>
                <div className="text-2xl font-bold text-foreground">${stats.totalSpend.toLocaleString()}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-muted-foreground text-sm mb-2">活跃账户数</div>
                <div className="text-2xl font-bold text-foreground">12 / 15</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-muted-foreground text-sm mb-2">违规/封户风险</div>
                <div className="text-2xl font-bold text-green-600">无风险</div>
              </CardContent>
            </Card>
          </div>
        </div>
      );
    }

    // 视图 2: 开户草稿
    if (selectedNode.type === 'draft_account') {
      return (
        <div className="p-8 max-w-3xl mx-auto w-full">
          <div className="flex justify-between items-center mb-8 pb-4 border-b border-border">
            <div>
              <h2 className="text-xl font-semibold text-foreground">{selectedNode.label}</h2>
              <p className="text-muted-foreground text-sm mt-1">ID: {selectedNode.id}</p>
            </div>
            <span className="px-3 py-1 bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-400 rounded-full text-xs font-bold">草稿</span>
          </div>
          
          <form className="space-y-6" onSubmit={(e) => {
            e.preventDefault();
            processIntent("查看简报"); 
          }}>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">广告平台</label>
                <Input type="text" value={selectedNode.data?.platform || ''} disabled />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">账户时区</label>
                <select className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm">
                  <option>UTC-05:00 (EST)</option>
                  <option>UTC-08:00 (PST)</option>
                  <option>UTC+08:00 (CST)</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-foreground mb-2">账户名称</label>
                <Input type="text" placeholder="例如：Project_Game_US_01" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-foreground mb-2">推广链接 (Promote URL)</label>
                <Input type="text" placeholder="https://" />
              </div>
            </div>
            
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline">保存草稿</Button>
              <Button type="submit">提交审核</Button>
            </div>
          </form>
        </div>
      );
    }

    // 视图 3: 充值工单
    if (selectedNode.type === 'topup_order') {
      return (
        <div className="p-8 max-w-3xl mx-auto w-full">
          <header className="mb-8 flex items-center gap-3 pb-4 border-b border-border">
            <div className="p-3 bg-green-100 dark:bg-green-950 text-green-600 dark:text-green-400 rounded-xl">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">资金划拨确认</h2>
              <p className="text-muted-foreground text-sm">工单号: {selectedNode.id}</p>
            </div>
          </header>

          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <span className="text-muted-foreground">充值金额</span>
                <span className="text-3xl font-bold text-foreground">${selectedNode.data?.amount}</span>
              </div>
              
              <div className="space-y-4">
                <label className="block text-sm font-medium text-foreground">目标账户</label>
                <div className="border border-border rounded-lg divide-y divide-border">
                  <div className="p-3 flex items-center justify-between hover:bg-secondary/50 cursor-pointer bg-primary/5">
                    <span className="font-medium text-foreground">Game_US_iOS_01 (TikTok)</span>
                    <CheckCircle className="w-4 h-4 text-primary" />
                  </div>
                  <div className="p-3 flex items-center justify-between hover:bg-secondary/50 cursor-pointer">
                    <span className="text-muted-foreground">Ecom_EU_Android (Meta)</span>
                    <div className="w-4 h-4 border border-border rounded-full"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button className="w-full" size="lg">
            确认划拨
          </Button>
        </div>
      );
    }

    // 视图 4: 绑定任务
    if (selectedNode.type === 'binding_task') {
      return (
        <div className="p-8 max-w-3xl mx-auto w-full">
          <header className="mb-8 pb-4 border-b border-border">
            <h2 className="text-xl font-semibold text-foreground">商务中心绑定 (BC Binding)</h2>
            <p className="text-muted-foreground text-sm mt-1">关联广告账户与媒体商务管理平台</p>
          </header>

          <div className="space-y-6">
            {/* 步骤 1: 选账户 */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-medium text-foreground mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">1</span>
                  选择待绑定账户
                </h3>
                <div className="relative">
                  <select className="w-full h-9 rounded-md border border-input bg-background pl-10 pr-3 py-1 text-sm appearance-none">
                    <option>Game_US_iOS_01 (TikTok)</option>
                    <option>Ecom_EU_Android (Meta)</option>
                  </select>
                  <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
                </div>
              </CardContent>
            </Card>

            {/* 连接线 */}
            <div className="flex justify-center -my-2 relative z-10">
              <Link2 className="w-6 h-6 text-muted-foreground rotate-90" />
            </div>

            {/* 步骤 2: 选 BC */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-medium text-foreground mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">2</span>
                  选择商务中心
                </h3>
                <div className="space-y-3">
                  {['Global_Agency_BC_01', 'North_America_Reseller_BM'].map(bc => (
                    <label key={bc} className="flex items-center gap-3 p-3 border border-border rounded-lg hover:border-primary cursor-pointer">
                      <input type="radio" name="bc" className="text-primary focus:ring-primary" />
                      <span className="text-sm font-medium text-foreground">{bc}</span>
                    </label>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Button className="w-full" size="lg">
              建立绑定关系
            </Button>
          </div>
        </div>
      );
    }

    // 默认视图：账户详情
    if (selectedNode.type === 'account') {
      return (
        <div className="p-8">
          <div className="mb-6 border-b border-border pb-4 flex justify-between items-start">
            <div>
              <h2 className="text-xl font-semibold flex items-center text-foreground">
                {selectedNode.label}
                {selectedNode.data?.status === 'Active' && <CheckCircle className="w-5 h-5 ml-2 text-green-500"/>}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">ID: {selectedNode.id}</p>
            </div>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="w-5 h-5" />
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground text-sm mb-2 flex items-center gap-2">
                  <Wallet className="w-4 h-4"/> 当前余额
                </p>
                <p className="text-3xl font-bold text-foreground">${selectedNode.data?.balance?.toFixed(2)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground text-sm mb-2 flex items-center gap-2">
                  <Building2 className="w-4 h-4"/> 所属平台
                </p>
                <p className="text-3xl font-bold text-foreground">{selectedNode.data?.platform}</p>
              </CardContent>
            </Card>
          </div>

          <div className="border-t border-border pt-6">
            <h3 className="text-sm font-semibold text-foreground uppercase mb-4">快捷操作</h3>
            <div className="flex gap-3">
              <Button 
                onClick={() => processIntent(`给 ${selectedNode.label} 充值`)}
                variant="secondary"
              >
                充值
              </Button>
              <Button 
                onClick={() => processIntent(`绑定 ${selectedNode.label}`)}
                variant="outline"
              >
                商务绑定
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return <div className="p-8 text-center text-muted-foreground">未知节点类型</div>;
  };

  return (
    <div className="flex h-full bg-background text-foreground overflow-hidden">
      
      {/* --- 左侧：LUI 控制台 (30%) --- */}
      <div className="w-[30%] min-w-[320px] border-r border-border flex flex-col bg-muted/30">
        <div className="p-4 border-b border-border bg-card flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Bot className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-semibold text-foreground">AI Console</span>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={cn(
              "flex",
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            )}>
              <div className={cn(
                "max-w-[85%] rounded-lg p-3 text-sm leading-relaxed",
                msg.role === 'user' 
                  ? 'bg-primary text-primary-foreground rounded-br-none' 
                  : 'bg-card border border-border text-card-foreground rounded-bl-none'
              )}>
                {msg.content}
                {msg.relatedNodeId && (
                  <Button 
                    variant="link"
                    size="sm"
                    onClick={() => setSelectedNodeId(msg.relatedNodeId!)}
                    className="block mt-2 text-xs h-auto p-0"
                  >
                    查看详情 →
                  </Button>
                )}
              </div>
            </div>
          ))}
          {isProcessing && (
            <div className="flex items-center gap-2 text-muted-foreground text-xs pl-2">
              <Loader2 className="w-3 h-3 animate-spin" /> 正在处理指令...
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="p-4 bg-card border-t border-border">
          <div className="relative">
            <Input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="输入指令 (如: 开户, 充值 500, 简报)..."
              className="w-full pr-12"
            />
            <Button 
              onClick={handleSend}
              size="icon"
              className="absolute right-2 top-2"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* --- 中间：Result Tree (20%) --- */}
      <div className="w-[20%] min-w-[240px] border-r border-border bg-muted/20 flex flex-col">
        <div className="p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-border flex justify-between items-center">
          工作台对象
          <span className="bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded text-[10px]">
            {treeData.reduce((acc, node) => acc + 1 + (node.children?.length || 0), 0)} Items
          </span>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {treeData.map(node => (
            <TreeNodeRenderer key={node.id} node={node} level={0} />
          ))}
        </div>
      </div>

      {/* --- 右侧：GUI 渲染器 (50%) --- */}
      <div className="flex-1 bg-background overflow-y-auto relative">
        {renderContent()}
      </div>

    </div>
  );
}

