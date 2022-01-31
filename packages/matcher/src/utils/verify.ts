import * as yup from "yup"
import { compose } from "@webare/utils"
import { MatcherMessage } from "types"

const schema = yup.object({
  type: yup.string(),
  payload: yup.object(),
})

export const verifyMessage = async (
  message: any
): Promise<MatcherMessage | undefined> => {
  const isValid = await schema.validate(message)
  if (isValid) return message
  return undefined
}
