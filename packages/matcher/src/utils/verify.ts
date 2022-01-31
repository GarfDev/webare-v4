import * as yup from "yup"
import { MatcherMessage } from "types"

const schema = yup.object({
  type: yup.string(),
  payload: yup.object(),
})

export const verifyMessage = (message: any): MatcherMessage | undefined => {
  const isValid = schema.validateSync(message)
  if (isValid) return message
  return undefined
}
