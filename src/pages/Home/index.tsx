import { HandPalm, Play } from 'phosphor-react'

import { useContext } from 'react'
import {
  HomeContainer,
  StartCountdownButton,
  StopCountdownButton,
} from './styles'
import { NewCtcleForm } from './components/NewCycleForm'
import { Countdown } from './components/Countdown'
import * as zod from 'zod'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CyclesContex } from '../../contexts/CyclesContext'

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'Informe a tarefa'),
  minutesAmount: zod
    .number()
    .min(1, 'O ciclo precisa ter no mínimo 5 minutos.')
    .max(60, 'O ciclo precisa ter no máximo 60 minutos.'),
})

type NewCycleFromData = zod.infer<typeof newCycleFormValidationSchema>

export function Home() {
  const { activeCycleId, createNewCycle, interruptCurrentCycle } =
    useContext(CyclesContex)

  const newCyclesForm = useForm<NewCycleFromData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0,
    },
  })

  const { handleSubmit, watch, reset } = newCyclesForm

  function handleCreateNewCycle(data: NewCycleFromData) {
    createNewCycle(data)
    reset()
  }

  const task = watch('task')
  const isSumbmitDesable = !task

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)}>
        <FormProvider {...newCyclesForm}>
          <NewCtcleForm />
        </FormProvider>

        <Countdown />

        {activeCycleId ? (
          <StopCountdownButton onClick={interruptCurrentCycle} type="button">
            <HandPalm size={24} />
            Interromper
          </StopCountdownButton>
        ) : (
          <StartCountdownButton disabled={isSumbmitDesable} type="submit">
            <Play size={24} />
            Começar
          </StartCountdownButton>
        )}
      </form>
    </HomeContainer>
  )
}
