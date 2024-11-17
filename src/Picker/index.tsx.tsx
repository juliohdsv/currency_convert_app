import { Picker } from "@react-native-picker/picker";

type PropsIndex = {
  data: Array<{
    key: string;
    label: string;
    value: string;
  }>;
  selected: string | null; 
  onChange: (value: string) => void; 
};

export function PickerItem({ data, selected, onChange }: PropsIndex) {
  return (
    <Picker
      selectedValue={selected} 
      onValueChange={(value) => onChange(value)} 
    >
      {data.map((item) => (
        <Picker.Item
          key={item.key} 
          label={item.label} 
          value={item.value} 
        />
      ))}
    </Picker>
  );
}