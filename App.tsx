import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { 
  StyleSheet, Text, View, 
  ActivityIndicator, TextInput, 
  TouchableOpacity  
} from 'react-native';

import { theme } from './src/theme';
import { PickerItem } from './src/Picker/index.tsx';
import { api } from './src/services/api';

interface CurrencyItem {
  key: string;
  label: string;
  value: string;
}

export default function App() {

  const [loading, setLoading] = useState(true);
  const [currencies, setCurrencies] = useState<CurrencyItem[]>([]);

  const [handle, setHandle] = useState<string | null>(null);
  const [handleValue, setHandleValue] = useState<string | null>(null);
  const [convertValue, setConverteValue] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      let arrCurrency: CurrencyItem[] = [];
      try {
            const res = await api.get("all");
            
            if (res.data) {
              Object.keys(res.data).map((key) => {
                arrCurrency.push({
                  key: key,
                  label: key,
                  value: key,
                });
              });
            }

              setCurrencies(arrCurrency);
              setHandle(arrCurrency.length > 0 ? arrCurrency[0].key : null);
              setLoading(false);
          } catch (error) {
              console.error("Erro ao carregar os dados:", error);
              setLoading(false);
      }
    }

    loadData();
  }, []);

  async function convert(){
    if(Number(handleValue) === 0 || handleValue === null){
      return
    }
    
    const res = await api.get(`all/${handle}-BRL`);
    let result = (res.data[handle].ask * parseFloat(handleValue));
    setConverteValue(result.toFixed(2));
  }

  if(loading){
    return(
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={theme.colors.black} size="large"/>
      </View>
    )
  }else{
    return (
      <View style={styles.container}>
        <View style={styles.currencyArea}>
          <Text style={styles.title}>Selecione sua moeda</Text>
          <PickerItem 
            data={currencies}
            selected={handle}
            onChange={ (currencyType:string)=> setHandle(currencyType) }
          />
        </View>

        <View style={styles.valueArea}>
          <Text style={styles.title}>Digite um valor para converter em R$</Text>
          <TextInput
            style={styles.input}
            keyboardType='numeric'
            placeholder='EX: 1.50'
            value={handleValue}
            onChangeText={ (value)=> {
              setConverteValue(null)
              setHandleValue(value)}
            }
          />
        </View>

        <TouchableOpacity 
          style={styles.butttonArea}
          onPress={convert}
        >
          <Text style={styles.buttonTitle}>Converter</Text>
        </TouchableOpacity>

        {Number(convertValue) !== 0 && convertValue !== null && (
          <View style={styles.resultArea}>
            <Text style={styles.resultTitle}>
              {`${handle} ${handleValue}`}
            </Text>
            <Text style={styles.title}>corresponde a</Text>
            <Text style={styles.resultTitle}>
              {`R$ ${convertValue}`}
            </Text>
          </View>
        )}

        <StatusBar style="light" />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.black,
    alignItems: 'center',
    paddingTop: 40,
  },
  currencyArea:{
    backgroundColor: theme.colors.white,
    width: "90%",
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
    padding: 8,
    marginBottom: 1,
  },
  title:{
    fontSize: 16,
    color: theme.colors.black,
    fontWeight: 500,
    paddingLeft: 5,
    paddingTop: 5,
  },
  loadingContainer:{
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  valueArea:{
    backgroundColor: theme.colors.white,
    width: "90%",
    paddingTop:8,
    paddingBottom:8,
  },
  input:{
    width: "90%",
    padding:18,
    fontSize: 18,
    backgroundColor: theme.colors.white,
  },
  butttonArea:{
    width: "90%",
    height: 45,
    alignItems: "center",
    justifyContent: "center",
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    backgroundColor: theme.colors.red,
  },
  buttonTitle:{
    color: theme.colors.white,
    fontWeight: "bold",
    fontSize: 16,
  },
  resultArea:{
    width: "90%",
    marginTop: 34,
    borderRadius: 8,
    alignItems: "center",
    padding:24,
    backgroundColor: theme.colors.white,
  },
  resultTitle:{
    fontSize: 28,
    fontWeight: "bold",
    color: theme.colors.red,
    marginTop: 6,
  },
});
