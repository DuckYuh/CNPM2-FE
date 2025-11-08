import authorizedAxiosInstance from '~/utils/authorizedAxios'

export const logApi = {
    // Fetch audit logs with optional filters
    getAuditLogs: async (params = {}) => {
        const response = await authorizedAxiosInstance.get('/audit/logs', { 
            params: {
                page: params.page || 0,
                size: params.size || 20,
                userId: params.userId,
                action: params.action,
                from: params.from,
                to: params.to
            }
        })
        return response
    }
}

export default logApi