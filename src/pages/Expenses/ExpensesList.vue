<template>
  <div>
    <div class="months-navigation">
      <div
      :key="i"
      class="month-link"
      @click="setActiveMonth(month)"
      :class="{active: month.month === activeMonth.month}"
      v-for="(month, i) in groupedMonths"
      >
        <div class="month-label">{{ month.month }}</div>
        <div class="value-label" v-money-format="month.total"/>
      </div>
    </div>

    <div class="container-group">
      <div class="container">
        <div v-if="activeMonth.data && !activeMonth.data.length">
          Você não cadastrou nenhum gasto neste mês
        </div>

        <template>
          <ExpenseListItem 
          :key="index"
          :data="item"
          v-for="(item, index) in activeMonth.data"/> 
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import groupBy from 'lodash.groupby'
import moment from 'moment'
import ExpenseListItem from './ExpenseListItem'

export default {

  name: 'ExpensesList',

  components: {
    ExpenseListItem
  },

  data: () => ({
    expenses: [],
    activeMonth: {}
  }),

  created(){
    this.getData()
  },

  mounted(){
    this.setActiveMonth()
  },

  computed: {
    groupedMonths(){

      let groupedMonths = []

      const addCurrrentMonth = () => {
        groupedMonths.push({
          data: [],
          total: 0,
          month: moment().format('MM/YYYY')
        })
      }

      if(this.expenses.length){
        const months = groupBy(this.expenses, i => (
          moment(i.createdAt).format('MM/YYYY')
        ))
          const sortedMonths = Object.keys(months).sort((a,b) => {
          const pattern = 'MM/YYYY HH'

          return moment(`${a} 01`, pattern).isBefore(moment(`${b} 01`,pattern))
          ? -1
          : +1
        })

        groupedMonths = sortedMonths.map(month => ({
          month,
          data: months[month],
          total: months[month].map(i => +i.value).reduce((a, i) => a + i, 0)
        }))

        const lastMonth = moment(groupedMonths[groupedMonths.length -1].month, 'MM/YYYY')

        if(!lastMonth.isSame(moment(), 'month')){
          addCurrrentMonth()
        }

      }else{
        addCurrrentMonth()
      }

      return groupedMonths

    }
  },

  methods: {
    getData(){
      const ref = this.$firebase.database().ref(`/${window.uid}`)
      ref.on('value', data => {
        const values = data.val()
        this.expenses = Object.keys(values).map(i=>values[i])
      })
    },

    setActiveMonth(month = null){
      this.activeMonth = month || this.groupedMonths[this.groupedMonths.length -1]
    }

  }

}
</script>

<style lang="scss" scoped>

.months-navigation{
  display: flex;
  width: calc(100% + 30px);
  background: var(--featured-dark);
  margin-left: -15px;

  .month-link{
    padding: 15px;
    cursor: pointer;
    transition: .4s;
    text-align: center;
    &:hover{
      background: var(--featured);
    }
    &.active{
      background: var(--featured);
    }
    .value-label{
      color: var(--darker);
      font-size: 8pt;
    }

  }
}
.container-group{
  margin-left: -15px;
  width: calc(100% + 30px);
  overflow: hidden auto;
  height: calc(100vh - 69px);
}
.container{
  padding-top: 15px;
  padding-bottom: 15px;
  font-size: 15pt;
}
@media (max-width: 400px){
  .container{
    font-size: 0.8rem;
  }
}
@media (min-width: 401px) and (max-width: 700px){
  .container{
    font-size: 1.2rem;
  }
}
</style>