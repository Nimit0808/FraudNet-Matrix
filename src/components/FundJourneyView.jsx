import React, { useCallback, useMemo, useState } from 'react';
import { ReactFlow, Controls, Background, useNodesState, useEdgesState, MarkerType } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import dagre from 'dagre';
import { Building2, User, Landmark, Building } from 'lucide-react';

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const NODE_WIDTH = 240;
const NODE_HEIGHT = 100;

const getLayoutedElements = (nodes, edges, direction = 'LR') => {
  const isHorizontal = direction === 'LR';
  dagreGraph.setGraph({ rankdir: direction, ranker: 'network-simplex', nodesep: 80, ranksep: 180 });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const newNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    const newNode = {
      ...node,
      targetPosition: isHorizontal ? 'left' : 'top',
      sourcePosition: isHorizontal ? 'right' : 'bottom',
      position: {
        x: nodeWithPosition.x - NODE_WIDTH / 2,
        y: nodeWithPosition.y - NODE_HEIGHT / 2,
      },
    };
    return newNode;
  });

  return { nodes: newNodes, edges };
};

// Clean Professional Light Theme Nodes
const CustomerNode = ({ data, selected }) => (
  <div className={`px-5 py-4 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] rounded-2xl border-l-[6px] relative w-[240px] transition-all duration-300 group ${selected ? 'border-l-sky-500 border-t border-r border-b border-sky-200 shadow-[0_12px_40px_rgba(14,165,233,0.15)] scale-[1.02]' : 'border-l-sky-500 border-t border-r border-b border-slate-100 hover:border-slate-200'}`}>
    <div className="relative z-10 flex flex-col h-full">
      <div className="flex items-center gap-2 mb-2">
        <div className="p-1.5 bg-sky-50 rounded-lg border border-sky-100 text-sky-600">
          <User className="w-4 h-4" />
        </div>
        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{data.type}</div>
      </div>
      <div className="font-black text-slate-800 text-[16px] truncate tracking-wide">{data.label}</div>
      <div className="text-[11px] text-slate-500 mt-0.5 font-mono uppercase tracking-widest">{data.id}</div>
    </div>
  </div>
);

const AccountNode = ({ data, selected }) => (
  <div className={`px-5 py-4 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] rounded-2xl border-l-[6px] relative w-[240px] transition-all duration-300 group ${selected ? 'border-l-emerald-500 border-t border-r border-b border-emerald-200 shadow-[0_12px_40px_rgba(16,185,129,0.15)] scale-[1.02]' : 'border-l-emerald-500 border-t border-r border-b border-slate-100 hover:border-slate-200'}`}>
    <div className="relative z-10 flex flex-col h-full">
      <div className="flex items-center gap-2 mb-2">
        <div className="p-1.5 bg-emerald-50 rounded-lg border border-emerald-100 text-emerald-600">
          <Landmark className="w-4 h-4" />
        </div>
        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{data.type}</div>
      </div>
      <div className="font-black text-slate-800 text-[16px] truncate tracking-wide">{data.label}</div>
      <div className="text-[11px] text-slate-500 mt-0.5 font-mono uppercase tracking-widest">{data.id}</div>
    </div>
  </div>
);

const BranchNode = ({ data, selected }) => (
  <div className={`px-5 py-4 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] rounded-2xl border-l-[6px] relative w-[240px] transition-all duration-300 group ${selected ? 'border-l-slate-500 border-t border-r border-b border-slate-300 shadow-[0_12px_40px_rgba(100,116,139,0.15)] scale-[1.02]' : 'border-l-slate-400 border-t border-r border-b border-slate-100 hover:border-slate-200'}`}>
    <div className="relative z-10 flex flex-col h-full">
      <div className="flex items-center gap-2 mb-2">
        <div className="p-1.5 bg-slate-50 rounded-lg border border-slate-200 text-slate-600">
          <Building2 className="w-4 h-4" />
        </div>
        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{data.type}</div>
      </div>
      <div className="font-black text-slate-800 text-[16px] truncate tracking-wide">{data.label}</div>
      <div className="text-[11px] text-slate-500 mt-0.5 font-mono uppercase tracking-widest">{data.id}</div>
    </div>
  </div>
);

const ChannelNode = ({ data, selected }) => (
  <div className={`px-5 py-4 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] rounded-2xl border-l-[6px] relative w-[240px] transition-all duration-300 group ${selected ? 'border-l-purple-500 border-t border-r border-b border-purple-200 shadow-[0_12px_40px_rgba(168,85,247,0.15)] scale-[1.02]' : 'border-l-purple-500 border-t border-r border-b border-slate-100 hover:border-slate-200'}`}>
    <div className="relative z-10 flex flex-col h-full">
      <div className="flex items-center gap-2 mb-2">
        <div className="p-1.5 bg-purple-50 rounded-lg border border-purple-100 text-purple-600">
          <Building className="w-4 h-4" />
        </div>
        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{data.type}</div>
      </div>
      <div className="font-black text-slate-800 text-[16px] truncate tracking-wide">{data.label}</div>
      <div className="text-[11px] text-slate-500 mt-0.5 font-mono uppercase tracking-widest">{data.id}</div>
    </div>
  </div>
);

const nodeTypes = {
  customer: CustomerNode,
  account: AccountNode,
  branch: BranchNode,
  channel: ChannelNode,
};

const initialNodes = [
  { id: '1', type: 'customer', data: { label: 'Global Corp Shell', type: 'Customer', id: 'CUST-8819', score: 95 } },
  { id: '2', type: 'account', data: { label: 'Offshore Holding', type: 'Account', id: 'ACC-9921-USD', score: 82 } },
  { id: '3', type: 'channel', data: { label: 'RTGS Transfer', type: 'Channel', id: 'CH-RTGS', score: 45 } },
  { id: '4', type: 'branch', data: { label: 'Cayman Branch 02', type: 'Branch', id: 'BR-CYM-02', score: 90 } },
  { id: '5', type: 'account', data: { label: 'Trading Acct 1', type: 'Account', id: 'ACC-1102-USD', score: 88 } },
  { id: '6', type: 'account', data: { label: 'Trading Acct 2', type: 'Account', id: 'ACC-1103-USD', score: 76 } },
  { id: '7', type: 'customer', data: { label: 'Alexandrov LLC', type: 'Customer', id: 'CUST-4421', score: 92 } },
  { id: '8', type: 'channel', data: { label: 'Crypto Network', type: 'Channel', id: 'CH-CRYPTO', score: 85 } },
];

const edgeDefault = { 
  animated: true, 
  style: { strokeWidth: 3 }, 
  labelBgStyle: { fill: '#ffffff', fillOpacity: 1, stroke: '#e2e8f0', strokeWidth: 1 }, 
  labelBgPadding: [12, 8],
  labelBgBorderRadius: 8,
  labelStyle: { fill: '#0f172a', fontWeight: 800, fontSize: 13, letterSpacing: '0.05em' } 
};

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', label: '$5.2M', ...edgeDefault, style: { ...edgeDefault.style, stroke: '#0ea5e9' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#0ea5e9' } },
  { id: 'e2-3', source: '2', target: '3', label: '$5.2M', ...edgeDefault, style: { ...edgeDefault.style, stroke: '#0ea5e9' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#0ea5e9' } },
  { id: 'e3-4', source: '3', target: '4', label: '$5.2M', ...edgeDefault, style: { ...edgeDefault.style, stroke: '#8b5cf6' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#8b5cf6' } },
  { id: 'e4-5', source: '4', target: '5', label: '$2.6M', ...edgeDefault, style: { ...edgeDefault.style, stroke: '#f43f5e' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#f43f5e' } },
  { id: 'e4-6', source: '4', target: '6', label: '$2.6M', ...edgeDefault, style: { ...edgeDefault.style, stroke: '#f43f5e' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#f43f5e' } },
  { id: 'e5-7', source: '5', target: '7', label: '$2.6M', ...edgeDefault, style: { ...edgeDefault.style, stroke: '#f59e0b' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#f59e0b' } },
  { id: 'e6-8', source: '6', target: '8', label: '$2.55M', ...edgeDefault, style: { ...edgeDefault.style, stroke: '#a855f7' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#a855f7' } },
  { id: 'e8-7', source: '8', target: '7', label: '$2.55M', ...edgeDefault, style: { ...edgeDefault.style, stroke: '#f59e0b' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#f59e0b' } },
];

export default function FundJourneyView() {
  const { nodes: layoutedNodes, edges: layoutedEdges } = useMemo(
    () => getLayoutedElements(initialNodes, initialEdges),
    []
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);
  const [selectedNode, setSelectedNode] = useState(null);

  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  return (
    <div className="w-full h-full relative bg-slate-50/50 rounded-b-3xl">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.15 }}
        minZoom={0.1}
      >
        <Background color="#cbd5e1" gap={24} size={2} className="opacity-60" />
        <Controls className="bg-white border-slate-200 fill-slate-500 shadow-xl rounded-xl" />
      </ReactFlow>

      {/* Popover Panel in crisp frosted light glass */}
      {selectedNode && (
        <div className="absolute right-8 top-8 w-[340px] bg-white/90 backdrop-blur-xl rounded-3xl p-7 z-10 transition-all animate-in fade-in slide-in-from-right-8 duration-500 shadow-[0_20px_60px_rgba(0,0,0,0.1)] border border-white">
          <div className="flex justify-between items-start mb-8">
            <div className="pr-4">
              <h3 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] leading-none mb-2.5 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500 shadow-sm"></span>
                {selectedNode.data.type} Details
              </h3>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">{selectedNode.data.label}</h2>
            </div>
            <button 
              onClick={() => setSelectedNode(null)}
              className="text-slate-400 hover:text-slate-700 transition-colors bg-slate-50 hover:bg-slate-100 p-2 rounded-xl border border-slate-200"
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 shadow-inner">
              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">System Entity ID</div>
              <div className="font-mono text-[15px] text-slate-700 font-bold">{selectedNode.data.id}</div>
            </div>
            
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 shadow-inner">
              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Threat Assessment</div>
              <div className="flex items-center gap-4">
                <span className={`text-4xl font-black tracking-tight ${selectedNode.data.score > 85 ? 'text-rose-600' : selectedNode.data.score > 70 ? 'text-amber-500' : 'text-emerald-500'}`}>
                  {selectedNode.data.score}
                </span>
                <span className={`text-[11px] px-3 py-1.5 rounded-lg font-black uppercase tracking-[0.2em] border shadow-sm ${
                  selectedNode.data.score > 85 ? 'bg-rose-100 text-rose-700 border-rose-200' : 
                  selectedNode.data.score > 70 ? 'bg-amber-100 text-amber-700 border-amber-200' : 
                  'bg-emerald-100 text-emerald-700 border-emerald-200'
                }`}>
                  {selectedNode.data.score > 85 ? 'Critical' : selectedNode.data.score > 70 ? 'Elevated' : 'Normal'}
                </span>
              </div>
            </div>

            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 shadow-inner">
              <div className="text-[10px] font-bold uppercase tracking-widest text-amber-600/70 mb-2.5">AI Review Status</div>
              <div className="text-[13px] text-amber-700 font-bold flex items-center gap-3">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                </span>
                Flagged for Immediate Review
              </div>
            </div>
            
            <button className="w-full mt-4 py-3.5 bg-indigo-600 hover:bg-indigo-700 transition-all rounded-xl text-[13px] font-black uppercase tracking-widest text-white shadow-[0_4px_14px_rgba(79,70,229,0.3)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.4)] border border-indigo-500 active:scale-[0.98]">
              Open Full Profile
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
