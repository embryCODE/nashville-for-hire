const sdk = require('sharetribe-flex-integration-sdk')

const devConfig = {
  clientId: '4b2dddbd-b11e-4ae8-8244-52866bc1b6e6',
  clientSecret: '1d003c8325a74737ec595c245d107ed69a59fd94',
}

const prodConfig = {
  clientId: '66f0c469-c6f1-456e-95b8-06214f45fa3d',
  clientSecret: '47fe0ae2fa821d8fb595864a5a7857527e0af359',
}

const sdkInstance = sdk.createInstance(prodConfig)

const run = async () => {
  try {
    const res = await sdkInstance.users.query()
    const users = res.data.data

    users.forEach((user) => {
      const id = user.id.uuid
      const displayName = `${user.attributes.profile.firstName} ${user.attributes.profile.lastName}`

      sdkInstance.users.updateProfile({ id, displayName })
    })
  } catch (e) {
    console.error(e)
  }
}

run()
