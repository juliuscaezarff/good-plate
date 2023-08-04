import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF'
  },
  description: {
    color: '#2E9D4C',
    textAlign: 'center',
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    flex: 1,
    textAlignVertical: 'center'
  },
  bottom: {
    flex: 1,
    backgroundColor: '#D9D9D9',
    borderBottomLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    marginTop: -42,
    paddingTop: 12
  },
  items: {
    flex: 1,
    gap: 12
  },
  image: {
    flex: 1
  }
})