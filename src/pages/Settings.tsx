import { FunctionComponent } from 'react';

interface SettingsProps {}

const Settings: FunctionComponent<SettingsProps> = () => {
  return (
    <div className="flex flex-col w-full ">
      <h1 className="text-3xl font-bold mb-2 text-[#00000090]">Opções</h1>
      <hr />
    </div>
  );
};

export default Settings;
