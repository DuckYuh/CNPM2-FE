let messageApi = null

export const setMessageApi = (api) => {
  messageApi = api
}

export const getMessageApi = () => {
  if (!messageApi) throw new Error('messageApi chưa được khởi tạo!')
  return messageApi
}
