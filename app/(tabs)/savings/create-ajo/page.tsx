import NavHeader from '@/views/Navigation/nav-header'
import { useState } from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import CreateAjoGroupForm from './form'
import { CreateAjoGroupFormValues } from './schema'
import ViewAndSubmitForm from './ViewForm'

const createAjoGroupPageStyle = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 18, fontWeight: '500', color: '#FF6600', marginBottom: 4 },
  description: { fontSize: 13, fontWeight: '400', color: '#767676', marginBottom: 24 },
})

const CreateAjoGroupPage: React.FC = () => {
  const [formData, setData] = useState<CreateAjoGroupFormValues | null>(null)

  const handleSubmit = (data: CreateAjoGroupFormValues) => {
    setData(data)
  }

  const itemOpacity = useSharedValue(0)
  const itemY = useSharedValue(20)
  const itemStyle = useAnimatedStyle(() => ({
    opacity: itemOpacity.value,
    transform: [{ translateY: itemY.value }],
  }))

  itemOpacity.value = withTiming(1, { duration: 300 })
  itemY.value = withTiming(0, { duration: 300 })

  return (
    <ScrollView style={createAjoGroupPageStyle.container}>
      <NavHeader path="/savings" header="Ajo Savings" />
      <Animated.Text style={[createAjoGroupPageStyle.title, itemStyle]}>
        Let's create a public ajo group 😉
      </Animated.Text>
      <Animated.Text style={[createAjoGroupPageStyle.description, itemStyle]}>
        {formData ? 'Kindly verify details before creation' : 'Kindly enter group details below'}
      </Animated.Text>
      {formData ? <ViewAndSubmitForm {...formData} /> : <CreateAjoGroupForm onSubmit={handleSubmit} />}
    </ScrollView>
  )
}

export default CreateAjoGroupPage
