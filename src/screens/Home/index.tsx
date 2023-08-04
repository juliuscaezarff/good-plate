import { View, Image, Text, ScrollView } from "react-native";
import { styles } from "./styles";
import Button from "../../components/Button";
import { useState } from "react";
import { Tip } from "../../components/Tip";
import Item from "../../components/Item";

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

      <View style={styles.bottom}>
        <Tip message="Aqui vai uma dica"/>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 24 }}>
          <View style={styles.items}>
            <Item data={{ name: 'Vegetal', percentage: '95%' }}/>
          </View>
        </ScrollView>
      </View>
    </View>
  )
}
