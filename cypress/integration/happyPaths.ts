import { homepage, login } from '../helpers'

describe('Happy paths', () => {
  it('should render the home page', function () {
    homepage()
  })

  it('should login', () => {
    login()
  })
})
