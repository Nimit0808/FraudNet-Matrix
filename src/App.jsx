import { useState, useEffect, useMemo } from 'react';
import { 
    Background, 
    Controls, 
    MarkerType,
    useNodesState,
    useEdgesState,
    ReactFlow,
    Handle,
    Position
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { 
    Search, Clock, ChevronRight, 
    Download, LayoutDashboard, Users, FileBarChart, Settings, MapPin, Smartphone, CreditCard, Sparkles, ShieldAlert,
    TrendingUp, AlertTriangle, CheckCircle, Box, Phone, Globe, User, LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import dagre from 'dagre';

// ------------------------------------------------------------------------------------------------------------------
// COMPONENT: Custom Node (Corporate Bank Circle)
// ------------------------------------------------------------------------------------------------------------------
const CustomNode = ({ data, selected }) => {
    const isHighRisk = data.risk === 'high';
    const isSafe = data.risk === 'low';
    
    let Icon = CreditCard;
    if (data.label?.includes('Branch')) Icon = MapPin;
    if (data.label?.includes('Device')) Icon = Smartphone;

    const riskColor = isHighRisk ? '#e02020' : isSafe ? '#108e40' : '#005b9f';
    const bgOpacity = isHighRisk ? 'bg-[#fff5f5]' : isSafe ? 'bg-[#f0fdf4]' : 'bg-[#eef4f9]';

    return (
        <div className={`relative flex items-center gap-2 w-[180px] bg-white border rounded shadow-sm transition-all overflow-hidden ${
            selected ? 'border-[#005b9f] shadow-[0_0_0_2px_rgba(0,91,159,0.3)] z-50' : isHighRisk ? 'border-[#ffcccc]' : 'border-gray-200 hover:border-gray-300'
        }`}>
            <Handle type="target" position={Position.Left} className="opacity-0 z-0 !min-w-0" />
            <div className={`w-1.5 h-[50px] self-stretch`} style={{backgroundColor: riskColor}}></div>
            <div className="py-2 flex items-center justify-center">
                <div className={`p-1.5 rounded-full ${bgOpacity}`} style={{color: riskColor}}>
                    <Icon size={16} />
                </div>
            </div>
            <div className="flex flex-col flex-1 py-2 pr-2 overflow-hidden justify-center min-w-0">
                <div className="text-[12px] font-bold text-gray-800 truncate" title={data.customer || data.id}>
                    {data.customer || data.id}
                </div>
                <div className="text-[9px] text-gray-500 font-bold truncate tracking-wider uppercase mt-0.5">
                    {data.label}
                </div>
            </div>
            <Handle type="source" position={Position.Right} className="opacity-0 z-0 !min-w-0" />
        </div>
    );
};
const nodeTypes = { custom: CustomNode };

// ------------------------------------------------------------------------------------------------------------------
// MAIN APP COMPONENT
// ------------------------------------------------------------------------------------------------------------------
export default function App() {
    const [graphData, setGraphData] = useState(null);
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedNode, setSelectedNode] = useState(null);
    const [selectedEdge, setSelectedEdge] = useState(null);
    const [activeTab, setActiveTab] = useState('Active Alert Queue');

    // Mock Queue for traditional look
    const highPriorityQueue = [
        { id: 'CASE-9021', score: 98, type: 'Rapid Layering' },
        { id: 'CASE-8842', score: 92, type: 'Structuring' }
    ];

    useEffect(() => {
        fetch('/data.json')
            .then(res => res.json())
            .then(data => {
                setGraphData(data);
                populateFlow(data);
            })
            .catch(err => console.error("Failed to load graph data", err));
    }, []);

    const populateFlow = (data) => {
        if (!data) return;
        
        const activeNodes = data.nodes.map(n => ({
            ...n,
            type: 'custom',
            data: { ...n.data, id: n.id }
        }));

        const formattedEdges = data.edges.map(e => {
            const edgeData = e.data || e;
            const isSuspicious = edgeData.pattern_label && edgeData.pattern_label !== 'NORMAL';
            return {
                ...e,
                id: e.id || edgeData.id,
                source: e.source || edgeData.source,
                target: e.target || edgeData.target,
                data: edgeData,
                type: 'smoothstep',
                style: { 
                    stroke: isSuspicious ? '#e02020' : '#888888',
                    strokeWidth: isSuspicious ? 2 : 1.5,
                    opacity: 1
                },
                animated: isSuspicious,
                markerEnd: {
                    type: MarkerType.ArrowClosed,
                    color: isSuspicious ? '#e02020' : '#888888',
                    width: 15,
                    height: 15
                },
                className: 'transition-all duration-300'
            };
        }).filter(e => e.source && e.target);

        // Apply Dagre Layout
        const dagreGraph = new dagre.graphlib.Graph();
        dagreGraph.setDefaultEdgeLabel(() => ({}));
        dagreGraph.setGraph({ rankdir: 'LR', align: 'UL', ranker: 'network-simplex', nodesep: 50, ranksep: 150 });

        activeNodes.forEach((node) => {
            dagreGraph.setNode(node.id, { width: 180, height: 50 });
        });

        formattedEdges.forEach((edge) => {
            dagreGraph.setEdge(edge.source, edge.target);
        });

        dagre.layout(dagreGraph);

        activeNodes.forEach((node) => {
            const nodeWithPosition = dagreGraph.node(node.id);
            node.position = {
                x: nodeWithPosition.x - 180 / 2,
                y: nodeWithPosition.y - 50 / 2,
            };
        });

        setNodes(activeNodes);
        setEdges(formattedEdges);
    };

    const onNodeClick = (_, node) => {
        setSelectedNode(node);
        setSelectedEdge(null);
        setEdges(eds => eds.map(e => ({
            ...e,
            style: {
                ...e.style,
                opacity: (e.source === node.id || e.target === node.id) ? 1 : 0.1,
                strokeWidth: (e.source === node.id || e.target === node.id) ? 3 : 1
            }
        })));
    };

    const onEdgeClick = (_, edge) => {
        setSelectedEdge(edge);
        setSelectedNode(null);
        setEdges(eds => eds.map(e => ({
            ...e,
            style: {
                ...e.style,
                opacity: e.id === edge.id ? 1 : 0.1,
                strokeWidth: e.id === edge.id ? 3 : 1
            }
        })));
    };

    const onPaneClick = () => {
        setSelectedNode(null);
        setSelectedEdge(null);
        if(graphData) populateFlow(graphData);
    };

    const timelineEvents = useMemo(() => {
        if (!graphData) return [];
        let txns = graphData.edges.map(e => e.data);
        if (selectedNode) {
            txns = txns.filter(t => t.source === selectedNode.id || t.target === selectedNode.id);
        } else if (selectedEdge) {
            txns = [selectedEdge.data];
        }
        return txns.sort((a,b) => new Date(a.timestamp) - new Date(b.timestamp));
    }, [graphData, selectedNode, selectedEdge]);

    const renderAICopilot = () => {
        let label = "Compliance Analysis: High probability of Rapid Layering detected. Funds originated from Source Accounts and were rapidly structured across intermediary accounts within 6 minutes before converging at the final destination.";
        let riskScore = 98;
        let isHighRisk = true;

        if (selectedEdge && selectedEdge.data.pattern_label === 'NORMAL') {
            label = "Compliance Analysis: Standard transactional baseline. Funds were transferred via recognized retail channels with no structural anomalies or high-velocity structuring detected in the current window.";
            riskScore = 12;
            isHighRisk = false;
        }

        return (
            <div className="flex flex-col bg-white border border-gray-300 shadow-sm p-4 shrink-0 border-l-[4px] border-l-[#005b9f]">
                <div className="flex items-center justify-between mb-3 border-b border-gray-200 pb-2">
                    <div className="flex items-center gap-2">
                        <Sparkles size={16} className="text-[#005b9f]" />
                        <span className="text-[13px] font-bold text-[#005b9f] uppercase tracking-wide">Automated SAR Assessment</span>
                    </div>
                    {isHighRisk && (
                         <div className="text-[11px] bg-[#ffeeee] border border-[#ffcccc] rounded px-2 py-1 text-[#cc0000] font-bold flex gap-1 items-center">
                            <AlertTriangle size={12} className="text-[#cc0000] shrink-0" />
                            <span>FIU-IND REPORT REQUIRED</span>
                         </div>
                    )}
                </div>
                <div className="flex items-center justify-between">
                    <p className="text-[12px] text-gray-700 leading-relaxed font-semibold max-w-[70%]">
                        {label}
                    </p>
                    <button className="btn-primary flex items-center gap-2 px-4 py-2 shrink-0 h-fit">
                        <Download size={14} /> GENERATE EVIDENCE PDF
                    </button>
                </div>
            </div>
        );
    };

    // ------------------------------------------------------------------------------------------------------------------
    // TAB VIEWS
    // ------------------------------------------------------------------------------------------------------------------
    const renderActiveAlertQueue = () => (
        <div className="flex flex-col md:flex-row gap-4 h-[calc(100vh-180px)]">
            
            {/* LEFT COLUMN: Investigation Timeline */}
            <div className="w-full md:w-[350px] union-panel flex flex-col overflow-hidden shrink-0 h-full">
                <div className="bg-[#005b9f] text-white px-4 py-2 font-bold text-[14px] flex justify-between items-center">
                    <span>Transaction Timeline</span>
                    <span className="bg-white text-[#005b9f] rounded-full px-2 text-[10px]">{timelineEvents.length}</span>
                </div>
                
                <div className="flex-1 overflow-auto p-4 custom-scrollbar bg-white">
                    <div className="relative border-l-2 border-gray-200 ml-2 space-y-4">
                        <AnimatePresence>
                            {timelineEvents.map((ev, i) => {
                                const isSuspicious = ev.pattern_label !== 'NORMAL';
                                return (
                                    <motion.div 
                                        key={ev.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.02 }}
                                        className="relative pl-6"
                                    >
                                        <div className={`absolute -left-[5px] top-2 h-2 w-2 rounded-full ring-2 ring-white ${
                                            isSuspicious ? 'bg-[#e02020]' : 'bg-gray-400'
                                        }`} />
                                        
                                        <div className={`flex flex-col gap-1 p-3 border rounded transition-all duration-200 cursor-pointer ${
                                            selectedEdge?.id === ev.id ? 'border-[#005b9f] bg-[#eef4f9]' : 'border-gray-200 hover:bg-gray-50'
                                        }`}>
                                            <div className="flex justify-between items-center w-full">
                                                <span className="text-[11px] text-gray-500 font-normal">{format(new Date(ev.timestamp), "MMM dd, HH:mm")}</span>
                                                {isSuspicious ? (
                                                    <span className="text-[10px] text-[#e02020] font-bold">{ev.pattern_label}</span>
                                                ) : (
                                                    <span className="text-[10px] text-gray-400 font-bold">NORMAL</span>
                                                )}
                                            </div>
                                            
                                            <div className="flex items-center justify-between mt-1">
                                                <div className="flex items-center gap-1 font-bold text-[12px] w-2/3">
                                                    <span className={`${ev.source === selectedNode?.id ? 'text-[#005b9f]' : 'text-gray-800'} truncate`}>{ev.source}</span>
                                                    <ChevronRight size={12} className="text-gray-400 shrink-0" />
                                                    <span className={`${ev.target === selectedNode?.id ? 'text-[#005b9f]' : 'text-gray-800'} truncate`}>{ev.target}</span>
                                                </div>
                                                <span className="text-[14px] font-bold text-gray-900 shrink-0 ml-2">₹{ev.amount.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                                            </div>
                                            <div className="text-[10px] text-gray-500 mt-1 uppercase">Channel: {ev.channel_id?.replace('CH_','') || 'UNK'}</div>
                                        </div>
                                    </motion.div>
                                )
                            })}
                            {timelineEvents.length === 0 && (
                                <div className="text-[12px] text-gray-500 pl-6 italic">Select records from graph to view sequence.</div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* RIGHT COLUMN: Graph (flex-1) & Copilot Panel Bottom */}
            <div className="flex-1 flex flex-col gap-4 h-full min-w-0">
                <div className="flex-[3] union-panel flex flex-col overflow-hidden relative shadow-sm h-full">
                    <div className="bg-[#f5f5f5] border-b border-gray-200 px-4 py-2 font-bold text-[14px] text-gray-800 flex items-center gap-2 w-full shrink-0">
                        <Box size={16} className="text-[#005b9f]"/> Network Graph Explorer
                    </div>
                    
                    <div className="flex-1 w-full bg-white relative">
                        <ReactFlow
                            nodes={nodes}
                            edges={edges}
                            onNodesChange={onNodesChange}
                            onEdgesChange={onEdgesChange}
                            onNodeClick={onNodeClick}
                            onEdgeClick={onEdgeClick}
                            onPaneClick={onPaneClick}
                            nodeTypes={nodeTypes}
                            fitView
                            fitViewOptions={{ padding: 0.5 }}
                            minZoom={0.1}
                            maxZoom={2}
                        >
                            <Background color="#eee" gap={20} size={1} />
                            <Controls className="!bg-white !border-gray-300 !shadow-sm hover:[&>button]:!fill-[#005b9f] absolute top-4 right-4 z-50 flex flex-col gap-1" position="top-right" showInteractive={false}/>
                        </ReactFlow>
                    </div>
                </div>

                {/* BOTTOM COMPONENT: AI SAR Copilot */}
                {renderAICopilot()}
            </div>
        </div>
    );

    const renderInvestigationDashboard = () => (
        <div className="flex flex-col gap-6">
            <h2 className="text-[18px] font-bold text-[#005b9f] border-b-2 border-[#005b9f] pb-2 inline-block w-fit">Operations Overview</h2>
            
            <div className="grid grid-cols-4 gap-4">
                {[
                    { title: "Open Investigations", value: "24", icon: ShieldAlert },
                    { title: "Critical SARS Pending", value: "5", icon: AlertTriangle },
                    { title: "Entities Resolved", value: "1,240", icon: CheckCircle },
                    { title: "Daily Throughput", value: "₹4.2M", icon: TrendingUp },
                ].map((stat, i) => (
                    <div key={i} className="union-panel p-5 flex flex-col gap-3">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-[#eef4f9] rounded text-[#005b9f]">
                                <stat.icon size={16} />
                            </div>
                            <div className="text-[12px] font-bold text-gray-500 uppercase">{stat.title}</div>
                        </div>
                        <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div className="union-panel p-6 flex flex-col">
                    <div className="flex items-center justify-between mb-4 border-b pb-2 border-gray-200">
                        <h3 className="text-[14px] font-bold text-gray-800">Typology Distribution (30 Days)</h3>
                    </div>
                    <div className="flex flex-col gap-4 flex-1 justify-center">
                        {[
                            { label: "Rapid Layering", percent: 45, raw: "1,240 Alerts" },
                            { label: "Structuring (Smurfing)", percent: 25, raw: "680 Alerts" },
                            { label: "Round-Tripping", percent: 15, raw: "410 Alerts" },
                            { label: "High-Velocity Mules", percent: 10, raw: "275 Alerts" },
                        ].map((item, idx) => (
                            <div key={idx} className="flex flex-col gap-1">
                                <div className="flex justify-between items-end">
                                    <span className="text-[12px] font-bold text-gray-700">{item.label}</span>
                                    <span className="text-[11px] text-gray-500 font-bold">{item.raw}</span>
                                </div>
                                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                                    <div className="h-full bg-[#005b9f]" style={{ width: `${item.percent}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="union-panel p-6 flex flex-col">
                    <div className="flex items-center justify-between mb-4 border-b pb-2 border-gray-200">
                        <h3 className="text-[14px] font-bold text-gray-800 flex items-center gap-2">
                            Global Threat Nodes
                        </h3>
                        <div className="text-[10px] font-bold text-[#108e40] bg-[#e6f4ea] px-2 py-0.5 rounded border border-[#108e40]">LIVE SYNC</div>
                    </div>
                    
                    <div className="flex-1 overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-[#f8f9fa] border-y border-gray-200 text-[10px] uppercase font-bold text-gray-500">
                                <tr>
                                    <th className="px-4 py-2">Jurisdiction</th>
                                    <th className="px-4 py-2 text-right">Risk Score</th>
                                    <th className="px-4 py-2 text-right">Active Nodes</th>
                                </tr>
                            </thead>
                            <tbody className="text-[12px] font-bold text-gray-700">
                                {[
                                    { region: "Eastern Europe (EEU)", score: 94, nodes: 420 },
                                    { region: "South-East Asia (SEA)", score: 82, nodes: 315 },
                                    { region: "North America (NAM)", score: 65, nodes: 180 },
                                ].map((row, i) => (
                                    <tr key={i} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                                        <td className="px-4 py-3 flex items-center gap-2">
                                            <MapPin size={14} className="text-[#005b9f]" />
                                            {row.region}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${row.score > 90 ? 'text-[#e02020] bg-[#ffeeee]' : row.score > 80 ? 'text-[#e67e22] bg-[#fdf2e9]' : 'text-[#005b9f] bg-[#eef4f9]'}`}>
                                                {row.score}/100
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right text-gray-500 font-normal">
                                            {row.nodes.toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderEntityResolution = () => (
        <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
                <h2 className="text-[18px] font-bold text-[#005b9f] border-b-2 border-[#005b9f] pb-2 inline-block w-fit">Entity Master Directory</h2>
                <button className="btn-primary flex items-center gap-2"><Users size={14} /> MERGE PROFILES</button>
            </div>
            
            <div className="union-panel overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-[#f8f9fa] border-b border-gray-200 text-[11px] font-bold text-gray-600 uppercase">
                        <tr>
                            <th className="px-6 py-3">Customer ID / Name</th>
                            <th className="px-6 py-3">KYC Status</th>
                            <th className="px-6 py-3">Network Reach</th>
                            <th className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-[13px] font-bold text-gray-800">
                        {[
                            { id: "CUST_092", name: "Alpha Shell Corp", kyc: "PENDING REVIEW", nodes: 4 },
                            { id: "CUST_011", name: "Beta Holdings LTD", kyc: "VERIFIED", nodes: 2 },
                            { id: "CUST_044", name: "Gamma Logistics", kyc: "FAILED / SANCTIONED", nodes: 7 },
                        ].map((row, i) => (
                            <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <div className="text-gray-500 font-normal text-[11px]">{row.id}</div>
                                    <div>{row.name}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 flex w-fit items-center gap-1.5 rounded text-[10px] font-bold ${row.kyc.includes('FAILED') ? 'bg-[#ffeeee] text-[#e02020]' : row.kyc.includes('PENDING') ? 'bg-[#fdf2e9] text-[#e67e22]' : 'bg-[#e6f4ea] text-[#108e40]'}`}>
                                        {row.kyc}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-500 font-normal">{row.nodes} Linked Accounts</td>
                                <td className="px-6 py-4"><button className="text-[#005b9f] hover:underline uppercase text-[11px]">View Graph</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderReports = () => (
        <div className="flex flex-col gap-6">
            <h2 className="text-[18px] font-bold text-[#005b9f] border-b-2 border-[#005b9f] pb-2 inline-block w-fit">Regulatory Submissions</h2>
            <div className="grid grid-cols-3 gap-6">
                {[
                    { id: 'SAR-2024-001A', status: 'TRANSMITTED', date: 'Oct 24, 2024' },
                    { id: 'SAR-2024-002B', status: 'DRAFT_MODE', date: 'Oct 26, 2024' },
                    { id: 'SAR-2024-003C', status: 'AWAITING_SIG', date: 'Oct 28, 2024' }
                ].map((rep, i) => (
                    <div key={i} className="union-panel p-6 flex flex-col gap-3">
                        <div className="flex justify-between items-start border-b border-gray-200 pb-3 mb-2">
                            <div className="font-bold text-[14px] text-gray-900">{rep.id}</div>
                            <div className={`px-2 py-0.5 text-[9px] font-bold rounded ${rep.status === 'TRANSMITTED' ? 'bg-[#e6f4ea] text-[#108e40] border border-[#108e40]' : 'bg-[#fff] border border-[#e67e22] text-[#e67e22]'}`}>{rep.status}</div>
                        </div>
                        <div className="text-[12px] text-gray-600 font-bold">DUE DATE: <span className="font-normal text-gray-500">{rep.date}</span></div>
                        <button className="mt-2 text-center border border-[#005b9f] text-[#005b9f] bg-[#f8f9fa] hover:bg-[#005b9f] hover:text-white transition-colors py-2 text-[12px] font-bold rounded flex justify-center items-center gap-2"><Download size={14} /> PDF PACKAGE</button>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderSettings = () => (
        <div className="flex flex-col gap-6">
            <h2 className="text-[18px] font-bold text-[#005b9f] border-b-2 border-[#005b9f] pb-2 inline-block w-fit">Heuristic Model Configuration</h2>
            
            <div className="union-panel max-w-2xl">
                <div className="p-6 border-b border-gray-200 bg-[#f8f9fa]">
                    <h3 className="text-[14px] font-bold text-gray-800">Algorithm Thresholds</h3>
                    <p className="text-[11px] text-gray-500 mt-1">Adjust the core detection parameters for the TGNN engine. Restricted to L3 Admin.</p>
                </div>
                
                <div className="p-6 space-y-5">
                    <div>
                        <label className="block text-[12px] font-bold text-gray-700 mb-1">Structuring Threshold Pivot (INR)</label>
                        <input type="number" defaultValue={1000000} className="w-full border border-gray-300 rounded p-2 text-[13px] focus:outline-none focus:border-[#005b9f] bg-[#fbfbfb]" />
                    </div>
                    <div>
                        <label className="block text-[12px] font-bold text-gray-700 mb-1">Layering Time Differential (Hours)</label>
                        <input type="number" defaultValue={24} className="w-full border border-gray-300 rounded p-2 text-[13px] focus:outline-none focus:border-[#005b9f] bg-[#fbfbfb]" />
                    </div>
                    <div>
                        <label className="block text-[12px] font-bold text-gray-700 mb-1">Cycle Round-Trip Allowance (Days)</label>
                        <input type="number" defaultValue={30} className="w-full border border-gray-300 rounded p-2 text-[13px] focus:outline-none focus:border-[#005b9f] bg-[#fbfbfb]" />
                    </div>
                    
                    <button className="btn-primary mt-2">SAVE CONFIGURATION</button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#f0f2f5] font-sans flex flex-col text-[#333]">
            {/* Top Utility Bar */}
            <div className="bg-[#f8f9fa] border-b border-gray-200 text-[11px] flex justify-between px-8 py-1.5 text-gray-600">
                <div className="flex gap-4">
                    <span className="hover:text-[#005b9f] cursor-pointer">Government of India Undertaking</span>
                </div>
                <div className="flex gap-4 font-bold">
                    <span className="hover:text-[#005b9f] cursor-pointer">Skip to main content</span>
                    <span className="border-l border-gray-300 pl-4 hover:text-[#005b9f] cursor-pointer">Screen reader</span>
                    <span className="border-l border-gray-300 pl-4 hover:text-[#005b9f] cursor-pointer tracking-widest">A- A A+</span>
                    <span className="border-l border-gray-300 pl-4 hover:text-[#005b9f] cursor-pointer">English ▼</span>
                </div>
            </div>
            
            {/* Main Header */}
            <div className="bg-white px-8 py-4 flex items-center justify-between shadow-sm z-10">
                <div className="flex items-center gap-3">
                    {/* Mock Logo */}
                    <div className="flex items-center gap-2">
                        <div className="text-[28px] font-bold text-[#e02020] tracking-tighter">FUND</div>
                        <div className="text-[28px] font-bold text-[#005b9f] tracking-tighter italic">DNA</div>
                    </div>
                    <div className="text-gray-500 font-bold text-[12px] border-l-2 border-gray-300 pl-3 ml-2 flex flex-col leading-tight uppercase">
                        <span>AML & Fraud</span>
                        <span>Investigation Portal</span>
                    </div>
                </div>
                
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-4 text-[12px] font-bold text-[#444] border-r-2 border-gray-200 pr-6 mr-2">
                        <span className="hover:text-[#005b9f] cursor-pointer flex items-center gap-1"><Phone size={14} className="text-[#005b9f]"/> Contact Desk</span>
                        <span className="hover:text-[#005b9f] cursor-pointer flex items-center gap-1"><Globe size={14} className="text-[#005b9f]"/> Global Branches</span>
                    </div>
                    
                    <div className="flex bg-[#f1f1f1] rounded-full px-4 py-1.5 items-center border border-gray-300 w-64">
                        <input type="text" placeholder="Search Customer / Account" className="bg-transparent outline-none text-[12px] w-full text-gray-800" />
                        <Search size={14} className="text-[#005b9f] font-bold" />
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <div className="text-right">
                            <div className="text-[12px] font-bold text-[#005b9f]">Analyst J.Doe</div>
                            <div className="text-[10px] text-gray-500 font-bold">L3 Compliance</div>
                        </div>
                        <div className="h-9 w-9 rounded-full bg-[#f0f2f5] border border-gray-300 flex items-center justify-center text-[#005b9f]">
                            <User size={18} />
                        </div>
                    </div>
                    <button className="text-gray-500 hover:text-[#e02020]">
                        <LogOut size={20} />
                    </button>
                </div>
            </div>
            
            {/* Blue Nav Bar */}
            <div className="bg-[#005b9f] text-white px-8 flex shadow-md sticky top-0 z-20">
                <div className="flex w-full">
                    {[
                        { icon: LayoutDashboard, label: 'Investigation Dashboard' },
                        { icon: ShieldAlert, label: 'Active Alert Queue' },
                        { icon: Users, label: 'Entity Resolution' },
                        { icon: FileBarChart, label: 'Regulatory Reports' },
                        { icon: Settings, label: 'Platform Settings' },
                    ].map((item, i) => (
                        <button 
                            key={i}
                            className={`py-3 px-6 text-[13px] font-bold flex items-center justify-center gap-2 border-b-[4px] transition-all ${
                                activeTab === item.label 
                                ? 'border-[#e02020] bg-[#004780] text-white' 
                                : 'border-transparent text-gray-200 hover:bg-[#004780] hover:text-white'
                            }`}
                            onClick={() => setActiveTab(item.label)}
                        >
                            {/* <item.icon size={16} /> */}
                            {item.label}
                        </button>
                    ))}
                </div>
                
                {/* Right side alert indicator */}
                <div className="flex items-center ml-auto border-l border-[#004780] pl-6 bg-[#004780]">
                    <div className="flex items-center gap-2 text-[12px] font-bold px-4">
                        <div className="h-2 w-2 rounded-full bg-[#e02020] animate-pulse"></div>
                        <span>Critical Queue: {highPriorityQueue.length}</span>
                    </div>
                </div>
            </div>
            
            {/* Main Content */}
            <div className="flex-1 p-6 max-w-[1600px] mx-auto w-full">
                {/* DYNAMIC CONTENT ROUTER */}
                {activeTab === 'Awaiting Graph Analysis' && renderActiveAlertQueue()}
                {activeTab === 'Active Alert Queue' && renderActiveAlertQueue()}
                {activeTab === 'Investigation Dashboard' && renderInvestigationDashboard()}
                {activeTab === 'Entity Resolution' && renderEntityResolution()}
                {activeTab === 'Regulatory Reports' && renderReports()}
                {activeTab === 'Platform Settings' && renderSettings()}
            </div>
            
            <footer className="bg-white border-t border-gray-200 py-4 text-center text-[11px] text-gray-500 mt-auto">
                © 2026 Fundamental DNA AML Systems. Designed for authorized personnel only.
            </footer>
        </div>
    );
}
