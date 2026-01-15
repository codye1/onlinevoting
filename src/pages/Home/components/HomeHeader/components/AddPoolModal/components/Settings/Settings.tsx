import DropDown from '@components/DropDown.tsx';
import SettingSection from '@components/SettingSection.tsx';
import DateTimePicker from 'react-datetime-picker';

import {
  categoryOptions,
  visibilityOptions,
  voteIntervalOptions,
} from '../../../../../../constants.ts';
import { Control, Controller } from 'react-hook-form';
import type { AddPollFormValues } from '../../AddPollModal.tsx';
import Errors from '@components/Errors.tsx';

interface ISettings {
  control: Control<AddPollFormValues>;
  errors?: string[];
}

const Settings = ({ control, errors }: ISettings) => {
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
        <Controller
          name="closePollOnDate"
          control={control}
          render={({ field }) => (
            <SettingSection
              label={'Закрити опитування в заплановану дату'}
              checked={field.value}
              setChecked={(checked) => field.onChange(checked)}
              classNameChildren={'p-[5px]'}
            >
              <Controller
                name="expireAtDate"
                control={control}
                render={({ field: dateField }) => (
                  <DateTimePicker
                    className={'my-calendar'}
                    onChange={(v) => dateField.onChange(v)}
                    value={dateField.value}
                  />
                )}
              />
              {errors && <Errors errors={errors} />}
            </SettingSection>
          )}
        />

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
