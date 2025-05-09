import { ExpoConfig, ConfigContext } from "@expo/config"

require("ts-node/register")

module.exports = ({ config }: ConfigContext): Partial<ExpoConfig> => {
  const plugins = config.plugins ?? []

  return {
    ...config,
    plugins: [...plugins, require("./plugins/withSplashScreen").withSplashScreen],
    extra: {
      ...config.extra,
      env: {}
    }
  }
}
