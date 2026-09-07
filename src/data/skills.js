// 我的技能：HR 效率工具箱，每个技能可快速发起对应员工的对话
export const skills = [
  {
    id: 'jd-generator',
    name: 'JD 智能生成',
    icon: 'doc',
    color: '#2563eb',
    bg: '#eff6ff',
    desc: '输入岗位名称与要求，一键生成结构化职位描述',
    employeeId: 'recruiter',
    prompt: '请帮我生成一份【岗位名称待填】的职位描述（JD），包含岗位职责、任职要求、加分项，语言专业有吸引力。'
  },
  {
    id: 'resume-screen',
    name: '简历筛选评估',
    icon: 'search',
    color: '#059669',
    bg: '#ecfdf5',
    desc: '粘贴简历，给出匹配度评分与面试关注点',
    employeeId: 'recruiter',
    prompt: '我会发你一份候选人简历和岗位要求，请你从匹配度、优势、风险点三个维度评估，并给出面试追问建议。'
  },
  {
    id: 'interview-questions',
    name: '面试题生成',
    icon: 'chat',
    color: '#7c3aed',
    bg: '#f5f3ff',
    desc: '按岗位与级别生成结构化面试题与评分表',
    employeeId: 'recruiter',
    prompt: '请为【岗位+级别】生成一套结构化面试题，包含行为面试题、专业题、情景题，并附上评分维度。'
  },
  {
    id: 'training-plan',
    name: '培训方案设计',
    icon: 'book',
    color: '#d97706',
    bg: '#fffbeb',
    desc: '根据团队痛点输出培训目标、课程与排期',
    employeeId: 'trainer',
    prompt: '团队目前存在【待描述痛点】，请帮我设计一份季度培训方案，包含目标、课程清单、形式、排期与效果评估方式。'
  },
  {
    id: 'nine-box',
    name: '九宫格盘点',
    icon: 'grid',
    color: '#0891b2',
    bg: '#ecfeff',
    desc: '引导完成人才九宫格盘点与校准建议',
    employeeId: 'talent',
    prompt: '请引导我完成一次团队人才九宫格盘点：告诉我评估维度、打分标准、校准会流程，以及各象限人才的使用策略。'
  },
  {
    id: 'salary-structure',
    name: '薪酬结构测算',
    icon: 'coin',
    color: '#dc2626',
    bg: '#fef2f2',
    desc: '设计薪酬带宽、固浮比与调薪矩阵',
    employeeId: 'compensation',
    prompt: '请帮我为一家【行业/规模】公司设计薪酬结构，包含薪酬带宽、固浮比建议、年度调薪矩阵和注意事项。'
  },
  {
    id: 'okr-kpi',
    name: 'OKR / KPI 设计',
    icon: 'target',
    color: '#4f46e5',
    bg: '#eef2ff',
    desc: '为部门或岗位设计绩效指标与目标',
    employeeId: 'compensation',
    prompt: '请为【部门/岗位】设计一套绩效指标方案，对比 OKR 与 KPI 的适用性，给出指标示例与评分规则。'
  },
  {
    id: 'exit-interview',
    name: '离职面谈提纲',
    icon: 'logout',
    color: '#be185d',
    bg: '#fdf2f8',
    desc: '生成有温度且能挖到真因的面谈提纲',
    employeeId: 'offboarding',
    prompt: '请为一位【岗位/司龄】的离职员工生成一份离职面谈提纲，包含破冰、真因挖掘、改进建议收集，并提示法律风险。'
  },
  {
    id: 'onboarding-plan',
    name: '入职 30/60/90',
    icon: 'rocket',
    color: '#0d9488',
    bg: '#f0fdfa',
    desc: '生成新员工融入计划与检查清单',
    employeeId: 'onboarding',
    prompt: '请为新入职的【岗位】员工生成 30/60/90 天融入计划，包含学习目标、关键任务、导师安排与检查清单。'
  },
  {
    id: 'hr-dashboard',
    name: '人效看板指标',
    icon: 'chart',
    color: '#1d4ed8',
    bg: '#eff6ff',
    desc: '输出 HR 数据看板指标体系与口径',
    employeeId: 'people-analytics',
    prompt: '请为公司管理层设计一份 HR 数据看板指标体系，列出核心指标、计算口径、数据来源与预警阈值。'
  }
]

export function getSkill(id) {
  return skills.find((s) => s.id === id)
}
