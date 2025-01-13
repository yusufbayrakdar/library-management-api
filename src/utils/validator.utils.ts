const formatJoiErrorsIntoMessage = (errorDetails: any[]): string | undefined => {
	if (!Array.isArray(errorDetails)) return
	return errorDetails.map((errorItem: any) => errorItem?.message?.replaceAll('"', "'")).join(', ')
}

const validatorUtils = { formatJoiErrorsIntoMessage }
export default validatorUtils
