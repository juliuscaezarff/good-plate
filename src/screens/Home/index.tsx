import { useState } from "react";
import { View, Image, Text, ScrollView, Alert } from "react-native";
import * as ImagePicker from 'expo-image-picker'
import * as ImageManipulator from 'expo-image-manipulator'
import { api } from "../../services/api";

import { styles } from "./styles";

import { Tip } from "../../components/Tip";
import { Button } from "../../components/Button";
import { Item } from "../../components/Item";

export function Home() {
  const [selectedImageUri, setselectedImageUri] = useState('');
  const [isLoading, setIsLoading] = useState(false)

  async function handleSelectImage() {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()

      if(status !== ImagePicker.PermissionStatus.GRANTED) {
        return Alert.alert('É necessário conceder permissão para acessar seu álbum')
      }

      setIsLoading(true)

      const response = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 4],
        quality: 1,
      })

      if(response.canceled) {
        return setIsLoading(false)
      }

      // Manipulando a imagem para o envio na API
      if(!response.canceled) {
        const imgManipuled = await ImageManipulator.manipulateAsync(
          response.assets[0].uri,
          [{ resize: {width: 900} }],
          {
            compress: 1,
            format: ImageManipulator.SaveFormat.JPEG,
            base64: true
          }
        )

        setselectedImageUri(imgManipuled.uri)
        foodDetect(imgManipuled.base64)
      }

    } catch (error) {
      console.log(error)
    }
  }

  async function foodDetect(imageBase64: string | undefined ) {
    const response = await api.post(`/v2/models/${process.env.EXPO_PUBLIC_API_MODEL_ID}/versions/${process.env.EXPO_PUBLIC_API_MODEL_VERSION_ID}/outputs`, {
      'user_app_id': {
        'user_id': process.env.EXPO_PUBLIC_ID_USER_ID,
        'app_id': process.env.EXPO_PUBLIC_API_APP_ID
      },
      'inputs': [
        {
          'data': {
            'image': {
              'base64': imageBase64
            }
          }
        }
      ]
    })

    console.log(response)
    setIsLoading(false)
  }

  return (
    <View style={styles.container}>
      <Button onPress={handleSelectImage} disabled={isLoading}/>

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
