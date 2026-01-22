import DropDown from '@components/DropDown/DropDown.tsx';
import SettingSection from '@components/SettingSection.tsx';
import DateTimePicker from 'react-datetime-picker';

import {
  categoryOptions,
  visibilityOptions,
  voteIntervalOptions,
} from '../../../../../../constants.ts';
import { Control, Controller, UseFormSetValue } from 'react-hook-form';
import Errors from '@components/Errors.tsx';
import { useState } from 'react';
import { AddPollRequest } from '@utils/types.ts';

interface ISettings {
  control: Control<AddPollRequest>;
  errors?: string[];
  setValue: UseFormSetValue<AddPollRequest>;
}

const Settings = ({ control, errors, setValue }: ISettings) => {
  const [closePollOnDate, setClosePollOnDate] = useState<boolean>(false);

  return (
    <fieldset className={'pr-[5px] mt-[15px]'}>
      <section className="flex gap-[10px] mb-[15px]">
        <Controller
          name="resultsVisibility"
          control={control}
          render={({ field }) => (
            <DropDown
              label={'Результати'}
              name={'resultsVisibility'}
              options={visibilityOptions}
              value={field.value}
              onSelect={(value) => field.onChange(value)}
            />
          )}
        />
        <Controller
          name="category"
          control={control}
          render={({ field }) => (
            <DropDown
              label={'Категорія'}
              options={categoryOptions}
              name={'category'}
              value={field.value}
              onSelect={(value) => field.onChange(value)}
            />
          )}
        />
      </section>
      <section className="flex">
        <SettingSection
          label={'Закрити опитування в заплановану дату'}
          checked={closePollOnDate}
          setChecked={(checked) => {
            setClosePollOnDate(checked);
            if (checked) {
              setValue('expireAt', new Date(Date.now() + 1000 * 60 * 2));
            } else {
              setValue('expireAt', null);
            }
          }}
          classNameChildren={'p-[5px]'}
        >
          <div className="flex flex-col">
            <Controller
              name="expireAt"
              control={control}
              render={({ field: dateField }) => (
                <DateTimePicker
                  className={'my-calendar max-w-[150px]'}
                  onChange={(v) => dateField.onChange(v)}
                  value={dateField.value}
                />
              )}
            />
            {errors && <Errors errors={errors} />}
          </div>
        </SettingSection>
        <Controller
          name="changeVote"
          control={control}
          render={({ field }) => (
            <SettingSection
              label={'Зміна вибору'}
              checked={field.value}
              setChecked={(checked) => field.onChange(checked)}
              name={'changeVote'}
              classNameChildren={'p-[5px]'}
            >
              <Controller
                name="voteInterval"
                control={control}
                render={({ field: intervalField }) => (
                  <DropDown
                    options={voteIntervalOptions}
                    onSelect={(value) => intervalField.onChange(value)}
                    name={'voteInterval'}
                    value={intervalField.value}
                  />
                )}
              />
            </SettingSection>
          )}
        />
      </section>
    </fieldset>
  );
};

export default Settings;

/*



            <Controller
          name="closePollOnDate"
          control={control}
          render={({ field }) => (
            <SettingSection
              label={'Закрити опитування в заплановану дату'}
              checked={field.value}
              setChecked={(checked) => {
                field.onChange(checked);
                if (checked) {
                  setValue('expireAt', new Date(Date.now() + 1000 * 60 * 2));
                } else {
                  setValue('expireAt', null);
                }
              }}
              classNameChildren={'p-[5px]'}
            >
              <div className="flex flex-col">
                <Controller
                  name="expireAt"
                  control={control}
                  defaultValue={new Date(Date.now() + 1000 * 60 * 2)}
                  render={({ field: dateField }) => (
                    <DateTimePicker
                      className={'my-calendar max-w-[150px]'}
                      onChange={(v) => dateField.onChange(v)}
                      value={dateField.value}
                    />
                  )}
                />
                {errors && <Errors errors={errors} />}
              </div>
            </SettingSection>
          )}
        />
*/
