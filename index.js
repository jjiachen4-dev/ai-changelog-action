const OpenAI = require("openai");
const simpleGit = require("simple-git"); // 引入 Git 工具
const { subDays, format } = require("date-fns"); // 引入日期工具

// ================= 配置区域 =================
const API_KEY = "0290aaec-839b-416f-83f0-f9714a4601dd"; 
const ENDPOINT_ID = "ep-m-20251120232505-q9vz8"; 
// ===========================================

const client = new OpenAI({
    apiKey: API_KEY,
    baseURL: "https://ark.cn-beijing.volces.com/api/v3",
});

const git = simpleGit(); // 初始化 Git

async function run() {
    try {
        console.log("🕵️ 正在扫描当前项目的 Git 提交记录...");

        // 1. 获取最近 7 天的提交记录 (模拟真实场景，通常我们只关心最近的更新)
        const dateSince = format(subDays(new Date(), 7), 'yyyy-MM-dd');
        const log = await git.log({ '--since': dateSince });

        // 如果最近没提交，直接结束
        if (log.total === 0) {
            console.log("😅 最近 7 天好像没有提交代码哦，快去写点 Bug 吧！");
            return;
        }

        // 把提交记录整理成纯文本列表
        // 格式：[哈希简写] - 提交信息
        const commitMessages = log.all.map(c => `- ${c.message}`).join("\n");

        console.log(`✅ 找到了 ${log.total} 条提交记录，正在召唤 AI 进行润色...\n`);
        
        // 2. 发送给 AI
        const completion = await client.chat.completions.create({
            model: ENDPOINT_ID,
            messages: [
                {
                    role: "system",
                    content: `你是一个SaaS产品经理。你的任务是将程序员的 git commit log 转化为一份幽默、易读且吸引用户的 Release Notes。
                    
                    【严格规则】：
                    1. 只保留有用户价值的功能点 (feat) 和修复 (fix)。
                    2. 必须忽略无意义的像 'update', 'merge', 'chore', 'wip' 这种提交。
                    3. 如果提交信息里没有值得写的内容，就幽默地回复“本次主要是底层优化，为了更远的未来积蓄力量”。
                    4. 语气要像老朋友，活泼一点。`
                },
                {
                    role: "user",
                    content: `这是最近 7 天的提交记录，请帮我写一份更新日志：\n${commitMessages}`
                }
            ],
        });

        console.log("\n====== 🎉 你的专属更新日志 ======\n");
        console.log(completion.choices[0].message.content);

    } catch (error) {
        console.error("❌ 出错了:", error.message);
    }
}

run();