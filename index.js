const core = require('@actions/core'); // 引入 GitHub 官方工具
const OpenAI = require("openai");
const simpleGit = require("simple-git");
const { subDays, format } = require("date-fns");

async function run() {
    try {
        console.log("🚀 AI Changelog Action 启动...");

        // 1. 从外部获取输入参数 (不再写死！)
        // 用户在他们的 workflow 文件里填什么，这里就读到什么
        const API_KEY = core.getInput('api_key', { required: true });
        const ENDPOINT_ID = core.getInput('endpoint_id', { required: true });
        const LANGUAGE = core.getInput('language') || 'Chinese'; // 默认中文

        // 2. 初始化客户端
        const client = new OpenAI({
            apiKey: API_KEY,
            baseURL: "https://ark.cn-beijing.volces.com/api/v3",
            timeout: 60 * 1000,// <--- 新增这一行！设置超时为 60 秒 (默认可能是 10秒)
        });

        const git = simpleGit();

        // 3. 获取 Git 记录
        const dateSince = format(subDays(new Date(), 7), 'yyyy-MM-dd');
        const log = await git.log({ '--since': dateSince });

        if (log.total === 0) {
            console.log("😅 最近没有提交记录，跳过生成。");
            return;
        }

        const commitMessages = log.all.map(c => `- ${c.message}`).join("\n");
        console.log(`✅ 捕获到 ${log.total} 条提交，目标语言：${LANGUAGE}`);

        // 4. 召唤 AI
        const completion = await client.chat.completions.create({
            model: ENDPOINT_ID,
            messages: [
                {
                    role: "system",
                    content: `你是一个资深 SaaS 产品经理。请将 git commit log 转化为 ${LANGUAGE} (语言) 的 Release Notes。
                    风格要求：幽默、风趣、口语化。
                    规则：
                    1. 忽略 chore, wip, test 等无意义提交。
                    2. 重点突出 feat (✨) 和 fix (🐛)。
                    3. 即使输入是英文，也必须输出为 ${LANGUAGE}。`
                },
                {
                    role: "user",
                    content: `提交记录如下：\n${commitMessages}`
                }
            ],
        });

        const result = completion.choices[0].message.content;
        
        // 5. 输出结果，让 GitHub Action 的下一步能用到这个结果
        console.log("\n====== 生成结果 ======\n" + result);
        core.setOutput("changelog", result); // 把结果暴露出去

    } catch (error) {
        core.setFailed(`❌ 运行失败: ${error.message}`);
    }
}

run();