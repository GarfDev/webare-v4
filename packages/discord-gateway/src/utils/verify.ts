import { GatewayMessage } from "@webare/common"
import * as yup from "yup"

const schema = yup.object({
  type: yup.string().required(),
  payload: yup.object(),
})

export const verifyMessage = async (
  message: any
): Promise<GatewayMessage | undefined> => {
  const isValid = await schema.isValid(message)
  if (isValid) return message
  return undefined
}
