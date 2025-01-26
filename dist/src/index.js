import fetch from 'node-fetch';
import { SocksProxyAgent } from 'socks-proxy-agent';
import { HttpsProxyAgent } from 'https-proxy-agent';
import loadFromXLS from './loadXLSFile';
export default loadFromXLS;
/**
 * 检查单个代理的有效性
 * @param {string} proxyUrl 代理地址 (支持 http 或 socks)
 * @param {string} token Discord 的 API Token
 * @returns {Promise<boolean>} 返回代理是否有效
 */
export async function checkProxyAndFetch(proxyUrl, token) {
    try {
        let agent;
        // 根据代理协议选择代理 Agent
        if (proxyUrl.startsWith('socks')) {
            agent = new SocksProxyAgent(proxyUrl);
        }
        else if (proxyUrl.startsWith('http')) {
            agent = new HttpsProxyAgent(proxyUrl);
        }
        else {
            console.error(`❌ 代理 IP 格式不支持：${proxyUrl}`);
            return false;
        }
        // 检查代理是否有效
        const ipResponse = await fetch('https://api.ipify.org?format=json', {
            agent,
        });
        if (!ipResponse.ok) {
            console.error(`❌ 连接失败，无法访问 IP 服务：${proxyUrl}`);
            return false;
        }
        const ipData = await ipResponse.json();
        console.log(`✅ 连接成功，代理 IP: ${ipData?.ip}`);
        // 使用代理请求 Discord User API
        const discordResponse = await fetch('https://discord.com/api/v9/users/@me', {
            agent,
            headers: {
                Authorization: token,
                'Content-Type': 'application/json',
                Connection: 'keep-alive',
            },
            keepalive: true,
        });
        if (!discordResponse.ok) {
            console.error(`❌ 获取用户信息失败，Token 无效：${token}`);
            return false;
        }
        const userData = await discordResponse.json();
        const username = userData.global_name || userData.username || '未知用户';
        console.log(`✅ 获取用户信息成功，用户名：${username}，邮箱：${userData.email || '未提供邮箱'}`);
        return true; // 所有检查通过
    }
    catch (error) {
        console.error(`❌ 请求失败：${proxyUrl}，错误信息：${error.message}`);
        return false;
    }
}
/**
 * 批量测试代理
 * @param {Array<{proxy: string, token: string}>} proxyData 代理数组
 * @returns {Promise<boolean>} 如果所有代理都有效，返回 true，否则返回 false
 */
export async function checkProxiesAndFetch(proxyData) {
    let allPassed = true;
    for (const [index, { proxy, token }] of proxyData.entries()) {
        console.log(`🔄 [代理${index + 1}] 准备测试，代理：${proxy}`);
        if (!proxy || !token) {
            console.warn(`⚠️ [代理${index + 1}] 数据缺失，跳过测试`);
            allPassed = false;
            continue;
        }
        const result = await checkProxyAndFetch(proxy, token);
        if (!result) {
            allPassed = false; // 如果有任何失败，则标记为 false
        }
    }
    return allPassed; // 如果所有都通过返回 true，否则返回 false
}
