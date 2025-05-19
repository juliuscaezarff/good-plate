import { useState } from 'react'
import { View, Image, Text, ScrollView, Alert } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import * as ImageManipulator from 'expo-image-manipulator'

import { api } from '../../services/api'

import { foodContains } from '../../utils/foodContains'

import { styles } from './styles'

import { Tip } from '../../components/Tip'
import { Button } from '../../components/Button'
import { Item, ItemProps } from '../../components/Item'
import { Loading } from '../../components/Loading'

export function Recognition() {
  const [selectedImageUri, setSelectedImageUri] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [items, setItems] = useState<ItemProps[]>([])
  const [message, setMessage] = useState('')

  async function handleSelectImage() {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()

      if (status !== ImagePicker.PermissionStatus.GRANTED) {
        return Alert.alert(
          'É necessário conceder permissão para acessar seu álbum'
        )
      }

      setIsLoading(true)

      const response = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 4],
        quality: 1
      })

      if (response.canceled) {
        return setIsLoading(false)
      }

      // Manipulando a imagem para o envio na API
      if (!response.canceled) {
        const imgManipuled = await ImageManipulator.manipulateAsync(
          response.assets[0].uri,
          [{ resize: { width: 900 } }],
          {
            compress: 1,
            format: ImageManipulator.SaveFormat.JPEG,
            base64: true
          }
        )

        setSelectedImageUri(imgManipuled.uri)
        foodDetect(imgManipuled.base64)
      }
    } catch (error) {
      console.log(error)
    }
  }

  async function foodDetect(imageBase64: string | undefined) {
    const response = await api.post(
      `/v2/models/${process.env.EXPO_PUBLIC_API_MODEL_ID}/versions/${process.env.EXPO_PUBLIC_API_MODEL_VERSION_ID}/outputs`,
      {
        "user_app_id": {
          "user_id": process.env.EXPO_PUBLIC_ID_USER_ID,
          "app_id": process.env.EXPO_PUBLIC_API_APP_ID
        },
        "inputs": [
          {
            "data": {
              "image": {
                "base64": imageBase64
              }
            }
          }
        ]
      }
    )


    const foods = response.data.outputs[0].data.concepts.map((concept: any) => {
      return {
        name: concept.name,
        percentage: `${Math.round(concept.value * 100)}%`
      }
    })

    const isVegetable = foodContains(foods, 'vegetable')
    setMessage(isVegetable ? '' : 'não adicione vegetais em seu prato')

    setItems(foods)
    setIsLoading(false)
  }

  return (
    <View style={styles.container}>
      <Button onPress={handleSelectImage} disabled={isLoading} />

      {selectedImageUri ? (
        <Image
          source={{ uri: selectedImageUri }}
          style={styles.image}
          resizeMode="cover"
        />
      ) : (
        <Text style={styles.description}>
          Selecione a foto do seu prato para analizar
        </Text>
      )}

      <View style={styles.bottom}>
        {
          isLoading ? <Loading /> :
          <>
            {message && <Tip message={message} />}

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingVertical: 24 }}
            >
              <View style={styles.items}>
                {items.map(item => (
                  <Item key={item.name} data={item} />
                ))}
              </View>
            </ScrollView>
          </>
        }
      </View>
    </View>
  )
}
