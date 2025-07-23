import SquadCard from '@/components/squads/squad-card'
import { availableSquads } from '@/lib/static'
import NavHeader from '@/views/Navigation/nav-header'
import { Feather } from '@expo/vector-icons'
import { useState } from 'react'
import { StyleSheet, TextInput, View } from 'react-native'

const joinSquadPageStyle = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 16 },
  searchContainer: { position: 'relative', marginBottom: 16 },
  searchIcon: { position: 'absolute', left: 12, top: '50%', transform: [{ translateY: -9 }], color: '#9CA3AF' },
  input: {
    width: '100%',
    paddingVertical: 12,
    paddingLeft: 40,
    paddingRight: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    fontSize: 16,
  },
  focusedInput: { borderColor: '#FF6B00' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, justifyContent: 'space-between' },
})

const JoinSquadPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const filteredSquads = availableSquads.filter((squad) => squad.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <View style={joinSquadPageStyle.container}>
      <NavHeader path="/squads" header="Squads Available" />
      <View style={joinSquadPageStyle.searchContainer}>
        <Feather name="search" size={18} style={joinSquadPageStyle.searchIcon} />
        <TextInput
          placeholder="search squad"
          style={[joinSquadPageStyle.input, isFocused && joinSquadPageStyle.focusedInput]}
          value={searchQuery}
          onChangeText={setSearchQuery}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </View>
      <View style={joinSquadPageStyle.grid}>
        {filteredSquads.map((squad, index) => (
          <View key={index} style={{ width: '48%' }}>
            <SquadCard squad={squad} />
          </View>
        ))}
      </View>
    </View>
  )
}

export default JoinSquadPage
