// telegram.tsx
import { Path, Svg, SvgProps } from 'react-native-svg'

const TelegramIcon: React.FC<SvgProps> = (props) => (
  <Svg viewBox="0 0 24 24" {...props}>
    <Path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8l-1.88 8.8c-.14.66-.76 1.02-1.28.82l-2.88-2.12-1.96 1.88c-.22.21-.5.33-.8.33-.56 0-1-.44-1-1v-6.14c0-.44.27-.84.68-1l6.94-4.24c.4-.24.88-.06 1.02.36.12.38-.02.78-.36.98l-5.6 3.42-2.1-1.96 7.34-4.48c.36-.22.82-.06 1.04.3z" />
  </Svg>
)

export default TelegramIcon
