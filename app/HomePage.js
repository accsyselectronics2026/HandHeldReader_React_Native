import {View, StyleSheet, NativeModules} from 'react-native';
import {
  Button,
  ButtonText,
  ButtonSpinner,
  ButtonIcon,
  Box,
  VStack,
  Center,
  HStack,
  Heading,
  FormControl,
} from '@gluestack-ui/themed';
import {useEffect, useState, useContext} from 'react';

import {AuthContext} from './store/auth-context';

const {ReaderModule} = NativeModules;
function HomePage({navigation}) {
  const [currentPage, SetCurrentPage] = useState('');
  const authCtx1 = useContext(AuthContext);

  useEffect(() => {
    function uhfinit() {
      var reader = ReaderModule.uhfreaderinit();
    }
    uhfinit();
  }, []);

  function HandleTruckRegister() {
    SetCurrentPage('Truck Register');
  }
  function HandleMainGateIn() {
    SetCurrentPage('Yard In');
  }

  function HandlePlantGateIn() {
    SetCurrentPage('Plant Gate In');
  }

  function HandlePackingPlantIn() {
    SetCurrentPage('Packing Plant In');
  }

  function HandlePackingPlantOut() {
    SetCurrentPage('Packing Plant Out');
  }

  function HandlePlantGateOut() {
    SetCurrentPage('Plant Gate Out');
  }

  function HandleMainGateOut() {
    SetCurrentPage('Yard Out');
  }

  if (currentPage !== '') {
    authCtx1.currentPageName = currentPage;
  }

  useEffect(() => {
    if (currentPage == '') {
    } else {
      navigation.navigate('Process');
      SetCurrentPage('');
    }
  }, [currentPage]);

  return (
    <View style={styles.container}>
      <FormControl
        p="$4"
        width={'$100'}
        borderWidth="$1"
        borderRadius="$lg"
        borderColor="$borderLight300"
        sx={{
          _dark: {
            borderWidth: '$1',
            borderRadius: '$lg',
            borderColor: '$borderDark800',
          },
        }}>
        <Center>
          <Heading italic={true} underline={true}>
            {' '}
            Location Selection{' '}
          </Heading>
        </Center>

        <HStack>
          <VStack>
            <Box>
              <Button
                size="xs"
                variant="solid"
                action="primary"
                m="$3"
                onPress={HandleTruckRegister}>
                <ButtonText>Truck Register </ButtonText>
              </Button>

              <Button
                size="xs"
                variant="solid"
                action="primary"
                m="$3"
                onPress={HandleMainGateIn}>
                <ButtonText>Yard In </ButtonText>
              </Button>

              <Button
                size="xs"
                variant="solid"
                action="primary"
                m="$3"
                onPress={HandlePlantGateIn}>
                <ButtonText>Plant Gate In </ButtonText>
              </Button>

              <Button
                size="xs"
                variant="solid"
                action="primary"
                m="$3"
                onPress={HandlePackingPlantIn}>
                <ButtonText>Packing Plant In </ButtonText>
              </Button>
            </Box>
          </VStack>

          <VStack>
            <Box>
              <Button
                size="xs"
                variant="solid"
                action="primary"
                m="$3"
                onPress={HandlePackingPlantOut}>
                <ButtonText>Packing Plant Out </ButtonText>
              </Button>

              <Button
                size="xs"
                variant="solid"
                action="primary"
                m="$3"
                onPress={HandlePlantGateOut}>
                <ButtonText> Plant Gate Out </ButtonText>
              </Button>

              <Button
                size="xs"
                variant="solid"
                action="primary"
                m="$3"
                onPress={HandleMainGateOut}>
                <ButtonText>Yard Out </ButtonText>
              </Button>
            </Box>
          </VStack>
        </HStack>
      </FormControl>
    </View>
  );
}

export default HomePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    // justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
    backgroundColor: 'white',
    padding: '3%',
  },
});
