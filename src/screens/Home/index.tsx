import { View, Image, Text } from "react-native";
import { styles } from "./styles";
import Button from "../../components/Button";
import { useState } from "react";

export default function Home() {
  const [selectedImageUri, setselectedImageUri] = useState('');

  async function handleSelectImage() {
    
  }

  return (
    <View style={styles.container}>
      <Button onPress={handleSelectImage}/>

      {
        selectedImageUri ?
        <Image 
          source={{ uri: selectedImageUri }} 
          style={styles.image}
          resizeMode="cover"
        />
        : 
        <Text style={styles.description}>
          Selecione a foto do seu prato para analizar
        </Text>
      }
    </View>
  )
}
