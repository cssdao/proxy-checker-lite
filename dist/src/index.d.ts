import loadFromXLS from './loadXLSFile';
export default loadFromXLS;
/**
 * 检查单个代理的有效性
 * @param {string} proxyUrl 代理地址 (支持 http 或 socks)
 * @param {string} token Discord 的 API Token
 * @returns {Promise<boolean>} 返回代理是否有效
 */
export declare function checkProxyAndFetch(proxyUrl: string, token: string): Promise<boolean>;
/**
 * 批量测试代理
 * @param {Array<{proxy: string, token: string}>} proxyData 代理数组
 * @returns {Promise<boolean>} 如果所有代理都有效，返回 true，否则返回 false
 */
export declare function checkProxiesAndFetch(proxyData: Array<{
    proxy: string;
    token: string;
}>): Promise<boolean>;
