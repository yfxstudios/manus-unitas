'use client'

import { qrcode } from "@/app/2fa/qrcode"
import { saveSecretKey, verify } from "@/app/2fa/verify"
import { Button } from "@/components/ui/button"
import { Dialog, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { useState } from "react"

const Security = (props) => {
  const [_2faStatus, set2FAStatus] = useState("disabled") // "enabled" | "disabled" | "initializing"
  const [qrData, setQRData] = useState()
  const [qrSecret, setQRSecret] = useState("")
  const [userToken, setUserToken] = useState("")
  const [errorText, setErrorText] = useState("")

  return (
    <div className="p-6 xs:p-16">
      <h1 className="text-3xl font-semibold text-center">Security</h1>
      <div className="flex flex-col gap-6 mt-6 max-w-2xl">
        <h4 className="text-lg font-semibold mt-6">Two-Factor Authentication</h4>
        <p className="text-sm">Two-factor authentication adds an extra layer of security to your account. Once enabled, you will be required to enter a unique code alongside your password when you sign in.</p>
        <Button
          onClick={async () => {
            set2FAStatus("initializing")
            const { data, secret } = await qrcode()
            setQRData(data)
            setQRSecret(secret)
          }}
          className="mb-4"
        >Enable Two-Factor Authentication</Button>
        <Input
          type="text"
          className="rounded-md text-black p-2 border border-solid text-center"
          maxLength={6}
          onChange={(e) => setUserToken(e.target.value)}
          placeholder="Enter the 6-digit code"
          value={userToken}
        />
        <Button
          onClick={async () => {
            const { verified } = await verify(qrSecret, userToken)
            if (verified) {
              set2FAStatus("enabled")
              setErrorText("")
              saveSecretKey(userToken, qrSecret, props.user._id)
            } else {
              setUserToken("")
              setErrorText("Failed. Please scan the QR code and repeat verification")
            }
          }}>
          Verify
        </Button>
        <p className="text-red-500">{errorText}</p>
        {console.log(qrData)}
        <img src={qrData} alt="QR Code" />
      </div>

    </div>
  )
}
export default Security