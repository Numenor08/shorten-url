export interface BaseApiType {
    status: 'success' | 'error' | 'fail';
    message?: string;
    data?: any;
    error?: any;
    metadata?: any;
}