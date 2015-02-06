<?php
//
// Database function wrappers (MySQLi extension)
//

// Returns connection ID or false on failure
// clean parameter is needed to initialize base mysqli class
function driver_db_connect($db_host, $db_user, $db_password)
{
	$db = new mysqli($db_host, $db_user, $db_password);

	return $db;
}

// Returns connection ID or false on failure
function driver_db_select($db_name)
{
	global $db;
	if (@mysqli_select_db($db, $db_name)) 
	{
		db_query('SET NAMES utf8');
		return $db;
	}
	return false;
}

function driver_db_create($db_name)
{
	return driver_db_query("CREATE DATABASE IF NOT EXISTS `$db_name`");
}

function driver_db_query($query)
{
	global $db;
	static $reconnect_attempts = 0;

	$result = mysqli_query($db, $query);

	if (empty($result)) {
		// Lost connection, try to reconnect (max - 3 times)
		if (driver_db_errno() == 2013 && $reconnect_attempts < 3) {
            if (defined('DB_HOST')) {
			    $db = db_initiate(DB_HOST, DB_USER, DB_PASS, DB_DATABASE);
            }
			$reconnect_attempts++;
			db_query($query);

		// Assume that the table is broken
		// Try to repair
		} elseif (preg_match("/'(\S+)\.(MYI|MYD)/", driver_db_error(), $matches)) {
			$result = mysqli_query("REPAIR TABLE $matches[1]");
		}
	}

	return $result;
}

function driver_db_result($result, $offset)
{
	return mysqli_field_seek($result, $offset);
}

function driver_db_fetch_row($result)
{
	return mysqli_fetch_row($result);
}

function driver_db_fetch_array($result)
{
	return mysqli_fetch_array($result, MYSQLI_ASSOC);
}

function driver_db_free_result($result)
{
	mysqli_free_result($result);
}

function driver_db_num_rows($result)
{
	return mysqli_num_rows($result);
}

function driver_db_insert_id()
{
	global $db;

	return mysqli_insert_id($db);
}

function driver_db_affected_rows()
{
	global $db;

	return mysqli_affected_rows($db);
}

function driver_db_errno()
{
	global $db;

	static $skip_error_codes = array (
		1091, // column exists/does not exist during alter table
		1176, // key does not exist during alter table
		1050, // table already exist 
		1060  // column exists
	);

	$errno = mysqli_errno($db);

	return in_array($errno, $skip_error_codes) ? 0 : $errno;
}

function driver_db_error()
{
	global $db;
	echo '<pre>';debug_print_backtrace();
	$r = mysqli_error($db);
	return $r;
}

?>
