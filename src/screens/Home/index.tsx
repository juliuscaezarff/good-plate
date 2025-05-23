import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
  Dimensions,
  LogBox,
  
} from 'react-native'
import React, { useEffect, useRef, useState } from 'react'

export function Home() {
  const flatlistRef = useRef()
  const screenWidth = Dimensions.get('window').width
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
		let interval = setInterval(() => {
			if (activeIndex === carouselData.length - 1) {
				flatlistRef.current.scrollToIndex({
					index: 0,
					animation: true,
				});
			} else {
				flatlistRef.current.scrollToIndex({
					index: activeIndex + 1,
					animation: true,
				});
			}
		}, 2000);

		return () => clearInterval(interval);
	});

  const getItemLayout = ({ data, index }: any) => ({
    length: screenWidth,
    offset: screenWidth * index, // for first image - 300 * 0 = 0pixels, 300 * 1 = 300, 300*2 = 600
    index: index
  })

  const carouselData = [
    {
      id: '01',
      image: require('../../assets/slider_1.png')
    },
    {
      id: '02',
      image: require('../../assets/slider_2.png')
    },
    {
      id: '03',
      image: require('../../assets/slider_3.png')
    }
  ]

  const renderItem = ({ item, index }: any) => {
    return (
      <View>
        <Image
          source={item.image}
          style={{ height: 200, width: screenWidth }}
        />
      </View>
    )
  }

  const handleScroll = ({ event }: any) => {
    // Get the scroll position
    const scrollPosition = event.nativeEvent.contentOffset.x
    console.log({ scrollPosition })
    // Get the index of current active item

    const index = scrollPosition / screenWidth

    console.log({ index })
    // Update the index

    setActiveIndex(index)
  }

  const renderDotIndicators = () => {
    return carouselData.map((dot, index) => {
      // if the active index === index

      if (activeIndex === index) {
        return (
          <View
            style={{
              backgroundColor: 'green',
              height: 10,
              width: 10,
              borderRadius: 5,
              marginHorizontal: 6
            }}
          ></View>
        )
      } else {
        return (
          <View
            key={index}
            style={{
              backgroundColor: 'red',
              height: 10,
              width: 10,
              borderRadius: 5,
              marginHorizontal: 6
            }}
          ></View>
        )
      }
    })
  }

  return (
    <View>
      <FlatList
        data={carouselData}
        ref={flatlistRef}
        getItemLayout={getItemLayout}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        horizontal={true}
        pagingEnabled={true}
        onScroll={handleScroll}
      />

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          marginTop: 30
        }}
      >
        {renderDotIndicators()}
      </View>
    </View>
  )
}
