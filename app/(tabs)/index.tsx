// // import HomePage from '@/views/Home'

import { Text, View } from 'react-native'

const HomePage: React.FC = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 20 }}>🏠 Home Page Loaded</Text>
    </View>
  )
}

export default function () {
  console.log('In home page')
  return <HomePage />
}
