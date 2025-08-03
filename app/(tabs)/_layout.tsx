import { UiIconSymbol } from '@/components/ui/ui-icon-symbol'
import { Tabs } from 'expo-router'
import React from 'react'
import { StyleSheet } from 'react-native'

const layoutStyle = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F2' },
})

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          backgroundColor: '#fff',
          paddingTop: 7,
          height: 70,
          paddingBottom: 12,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <UiIconSymbol size={28} name="wallet.pass.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="savings"
        options={{
          title: 'Savings',
          tabBarIcon: ({ color }) => <UiIconSymbol size={28} name="gearshape.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Account',
          tabBarIcon: ({ color }) => <UiIconSymbol size={28} name="ladybug.circle" color={color} />,
        }}
      />
    </Tabs>
  )
}
