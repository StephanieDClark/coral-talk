import React from 'react';
import cn from 'classnames';
import styles from './styles.css';
import {t} from 'plugin-api/beta/client/services';
import {ClickOutside} from 'plugin-api/beta/client/components';
import {Icon, Button} from 'plugin-api/beta/client/components/ui';

const name = 'talk-plugin-permalink';

export default class PermalinkButton extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      popoverOpen: false,
      copySuccessful: null,
      copyFailure: null
    };

  }

  toggle = () => {
    this.popover.style.top = `${this.linkButton.offsetTop - 80}px`;

    this.setState({
      popoverOpen: !this.state.popoverOpen
    });
  }

  handleClickOutside = () => {
    this.setState({
      popoverOpen: false
    });
  }

  copyPermalink = () => {
    this.permalinkInput.select();
    try {
      document.execCommand('copy');
      this.setState({
        copySuccessful: true,
        copyFailure: null
      });
    } catch (err) {
      this.setState({
        copyFailure: true,
        copySuccessful: null
      });
    }

    this.timeout = window.setTimeout(() => {
      this.setState({
        copyFailure: null,
        copySuccessful: null
      });
    }, 3000);
  }

  componentWillUnmount() {
    window.clearTimeout(this.timeout);
  }

  render () {
    const {copySuccessful, copyFailure, popoverOpen} = this.state;
    const {asset} = this.props;
    return (
      <ClickOutside onClickOutside={this.handleClickOutside}>
        <div className={cn(`${name}-container`, styles.container)}>
          
          <button
            ref={(ref) => this.linkButton = ref}
            onClick={this.toggle}
            className={`${name}-button`}>
              {t('permalink')}
            <Icon name="link" />
          </button>

          <div
            ref={(ref) => this.popover = ref}
            className={cn([`${name}-popover`, styles.popover, {[styles.active]: popoverOpen}])}>

            <input
              className={cn(styles.input, `${name}-copy-field`)}
              type='text'
              ref={(input) => this.permalinkInput = input}
              defaultValue={`${asset.url}?commentId=${this.props.commentId}`}
            />

            <Button
              onClick={this.copyPermalink}
              className={cn([
                styles.button,
                `${name}-copy-button`, {
                  [styles.success]:copySuccessful,
                  [styles.failure]: copyFailure
                }])}>
              {!copyFailure && !copySuccessful && 'Copy'}
              {copySuccessful && 'Copied'}
              {copyFailure && 'Not supported'}
            </Button>
            
          </div>
        </div>
      </ClickOutside>
    );
  }
}
