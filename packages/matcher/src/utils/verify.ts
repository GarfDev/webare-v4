import * as yup from "yup"
import { MatcherMessage } from "types"

const schema = yup.object({
  type: yup.string().required(),
  payload: yup.object(),
})

export const verifyMessage = async (
  message: any
): Promise<MatcherMessage | undefined> => {
  const isValid = await schema.isValid(message)
  if (isValid) return message
  return undefined
}
