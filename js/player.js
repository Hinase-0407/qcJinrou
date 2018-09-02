$(function() {
	// ----------------------------------------------------------------------
	// �v���C���[�̏����������N���X.
	// ----------------------------------------------------------------------
	function Player(playerId, userName) {
		// �v���C���[ID
		this.playerId = playerId;
		// �v���C���[��
		this.userName = userName;
		// �v���C���[�摜
		this.userImage = "";
		// �v���C���[�̖�E
		this.yakushoku = "";
		// �v���C���[�̑I���\�t���O
		this.selectFlag = false;
		// �I���v���C���[ID
		this.selectedPlayerId = "";
		// ����
		this.won = 0;
		// �s��
		this.losed = 0;
		// �Q�[���X�^�[�g���������t���O
		this.isReadyToStart = false;
	};

	/**
	 * �X�e�[�^�X�X�V �v���C���[��.
	 * @param userName	�v���C���[��
	 */
	Player.prototype.setName = function(userName) {
		this.userName = userName;
	};

	/**
	 * �X�e�[�^�X�X�V �v���C���[�摜.
	 * @param userImage	�v���C���[�摜
	 */
	Player.prototype.setImage = function(userImage) {
		this.userImage = userImage;
	};

	/**
	 * �X�e�[�^�X�X�V ��E.
	 * @param yakushoku	��E
	 */
	Player.prototype.setYakushoku = function(yakushoku) {
		this.yakushoku = yakushoku;
	};

	/**
	 * �X�e�[�^�X�X�V ��E.
	 * @param selectFlag	�v���C���[�̑I���\�t���O
	 */
	Player.prototype.setSelectFlag = function(selectFlag) {
		this.selectFlag = selectFlag;
	};

	/**
	 * �X�e�[�^�X�X�V ��E.
	 * @param selectedPlayerId	�I���v���C���[ID
	 */
	Player.prototype.setSelectedPlayerId = function(selectedPlayerId) {
		this.selectedPlayerId = selectedPlayerId;
	};

	/**
	 * �X�e�[�^�X�X�V ���s��.
	 * @param isWon	���s�itrue:����, false:�s�k�j
	 */
	Player.prototype.setResult = function(isWon) {
		if(isWon) {
			this.won++;
		} else {
			this.losed++;
		}
	};

	/**
	 * �X�e�[�^�X�X�V ��E.
	 * @param isReadyToStart	���������ہitrue:��������, false:�������j
	 */
	Player.prototype.setIsReadyToStart = function(isReadyToStart) {
		this.isReadyToStart = isReadyToStart;
	};
	
});