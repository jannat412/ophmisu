<?php
require_once dirname(__FILE__).'/mysqli.php';


function set_db($sdb = '') {
    global $db;
    $sdb = array(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    $db = db_initiate($sdb[0], $sdb[1], $sdb[2], $sdb[3]);
    if (!$db) {
        $trace = debug_backtrace();
        array_pop($trace);
        $trace = array_pop($trace);
        $err = 'CANNOT CONNECT TO THE DATABASE';
        //the_error_handler(10, $err, $trace['file'], $trace['line']);
        trigger_error('CANNOT CONNECT TO THE DATABASE');
        exit;
    }
	
    return true;
}

/**
 * Execute query and format result as associative array with column names as keys
 *
 * @param string $query unparsed query
 * @param mixed ... unlimited number of variables for placeholders
 * @return array structured data
 */
function db_array($query)
{
	$args = func_get_args();

	if ($_result = call_user_func_array('db_query', $args)) {
		while ($arr = driver_db_fetch_array($_result)) {
			$result[] = $arr;
		}

		driver_db_free_result($_result);
	}

	return !empty($result) ? $result : array();
}

/**
 * Execute query and format result as associative array with column names as keys and index as defined field
 *
 * @param string $query unparsed query
 * @param string $field field for array index
 * @param mixed ... unlimited number of variables for placeholders
 * @return array structured data
 */
function db_hash_array($query, $field)
{
	$args = array_slice(func_get_args(), 2);
	array_unshift($args, $query);

	if ($_result = call_user_func_array('db_query', $args)) {
		while ($arr = driver_db_fetch_array($_result)) {
			if (isset($arr[$field])) {
				$result[$arr[$field]] = $arr;
			}
		}

		driver_db_free_result($_result);
	}

	return !empty($result) ? $result : array();
}

/**
 * Execute query and format result as associative array with column names as keys and then return first element of this array
 *
 * @param string $query unparsed query
 * @param mixed ... unlimited number of variables for placeholders
 * @return array structured data
 */
function db_row($query)
{
	$args = func_get_args();

	if ($_result = call_user_func_array('db_query', $args)) {
		$result = driver_db_fetch_array($_result);

		driver_db_free_result($_result);
	}

	return is_array($result) ? $result : array();
}

/**
 * Execute query and returns first field from the result
 *
 * @param string $query unparsed query
 * @param mixed ... unlimited number of variables for placeholders
 * @return array structured data
 */
function db_field($query)
{
	$args = func_get_args();

	if ($_result = call_user_func_array('db_query', $args)) {
		$result = driver_db_fetch_row($_result);

		driver_db_free_result($_result);
	}

	return is_array($result) ? $result[0] : NULL;
}

/**
 * Execute query and format result as set of first column from all rows
 *
 * @param string $query unparsed query
 * @param mixed ... unlimited number of variables for placeholders
 * @return array structured data
 */
function db_fields($query)
{
	$args = func_get_args();
	$result = '';

	if ($__result = call_user_func_array('db_query', $args)) {
		$_result = array();
		while ($arr = driver_db_fetch_array($__result)) {
			$_result[] = $arr;
		}

		driver_db_free_result($__result);

		if (is_array($_result)) {
			$result = array();
			foreach ($_result as $k => $v) {
				array_push($result, reset($v));
			}
		}
	}

	return is_array($result) ? $result : array();
}

/**
 * Execute query and format result as one of: field => array(field_2 => value), field => array(field_2 => row_data), field => array([n] => row_data)
 *
 * @param string $query unparsed query
 * @param array $params array with 3 elements (field, field_2, value)
 * @param mixed ... unlimited number of variables for placeholders
 * @return array structured data
 */
function db_hash_multi_array($query, $params)
{
	@list($field, $field_2, $value) = $params;

	$args = array_slice(func_get_args(), 2);
	array_unshift($args, $query);

	if ($_result = call_user_func_array('db_query', $args)) {
		while ($arr = driver_db_fetch_array($_result)) {
			if (!empty($field_2)) {
				$result[$arr[$field]][$arr[$field_2]] = !empty($value) ? $arr[$value] : $arr;
			} else {
				$result[$arr[$field]][] = $arr;
			}
		}

		driver_db_free_result($_result);
	}

	return !empty($result) ? $result : array();
}

/**
 * Execute query and format result as key => value array
 *
 * @param string $query unparsed query
 * @param array $params array with 2 elements (key, value)
 * @param mixed ... unlimited number of variables for placeholders
 * @return array structured data
 */
function db_hash_single_array($query, $params)
{
	@list($key, $value) = $params;

	$args = array_slice(func_get_args(), 2);
	array_unshift($args, $query);

	if ($_result = call_user_func_array('db_query', $args)) {
		while ($arr = driver_db_fetch_array($_result)) {
			$result[$arr[$key]] = $arr[$value];
		}

		driver_db_free_result($_result);
	}

	return !empty($result) ? $result : array();
}

function prepare_query(&$query) {
    $query = trim($query);
    $search = 'select ,show , as , in (, not , where , set , limit , desc , asc , order by , on , left , join , right , inner , and , like , from ,count(,insert , into ,values(, update , set(, length(,unix_timestamp,date_format';
    $replace = explode(',', strtoupper($search));
    $search = explode(',', $search);
    $query = str_replace($search, $replace, $query);
    return $query;
}

/**
 * Execute query
 *
 * @param string $query unparsed query
 * @param mixed ... unlimited number of variables for placeholders
 * @return boolean always true, dies if problem occured
 */
function db_query($query) {
    global $db;
    if($db ===  null) if(!set_db()) return false;
    if(!$db) return false;

    prepare_query($query);
	$args = func_get_args();
	$query = db_process($query, array_slice($args, 1));
    
	if (empty($query)) {
		return false;
	}
	//if ('SELECT * FROM parameters_values AS M WHERE value_id = 1' == $query) aa(debug_backtrace()); 
	//aa($query);
	$result = driver_db_query($query);

	if ($result === true) {
        if ($i_id = driver_db_insert_id()) {
			return $i_id;
		}
	}

	db_error($result, $query, debug_backtrace());

	return $result;
}


/**
 * Parse query and replace placeholders with data
 *
 * @param string $query unparsed query
 * @param array $data data for placeholders
 * @return parsed query
 */
function db_process($pattern, $data = array(), $replace = true)
{
//	a('debug: ');a($pattern);a($data);
	$command = 'get';

	// Check if query updates data in the database
	if (preg_match("/^(UPDATE|INSERT INTO|REPLACE INTO|DELETE FROM) (\w+) /", $pattern, $m)) {
		$table_name = $m[2];
		$command = ($m[1] == 'DELETE FROM') ? 'delete' : 'set';
	}

	if (!empty($data) && preg_match_all("/\?(i|s|l|d|a|n|u|e|p|w|f)+/", $pattern, $m)) {
		$offset = 0;
		foreach ($m[0] as $k => $ph) {
			if ($ph == '?u' || $ph == '?e') {
				$data[$k] = check_table_fields($data[$k], $table_name);

				if (empty($data[$k])) {
					return false;
				}
			}

			if ($ph == '?i') { // integer
				$pattern = db_str_replace($ph, db_intval($data[$k]), $pattern, $offset); // Trick to convert int's and longint's

			} elseif ($ph == '?s') { // string
				$pattern = db_str_replace($ph, "'" . addslashes($data[$k]) . "'", $pattern, $offset);

			} elseif ($ph == '?l') { // string for LIKE operator
				$pattern = db_str_replace($ph, "'%" . addslashes(str_replace("\\", "\\\\", $data[$k])) . "%'", $pattern, $offset);

			} elseif ($ph == '?d') { // float
				$pattern = db_str_replace($ph, sprintf('%01.2f', $data[$k]), $pattern, $offset);

			} elseif ($ph == '?a') { // array FIXME: add trim
				$data[$k] = !is_array($data[$k]) ? array($data[$k]) : $data[$k];
				$pattern = db_str_replace($ph, "'" . implode("', '", array_map('addslashes', $data[$k])) . "'", $pattern, $offset);

			} elseif ($ph == '?n') { // array of integer FIXME: add trim
				$data[$k] = !is_array($data[$k]) ? array($data[$k]) : $data[$k];
				$pattern = db_str_replace($ph, !empty($data[$k]) ? implode(', ', array_map('db_intval', $data[$k])) : "''", $pattern, $offset);

			} elseif ($ph == '?u' || $ph == '?w') { // update/condition with and
				$q = '';
				$clue = ($ph == '?u') ? ', ' : ' AND ';
				foreach($data[$k] as $field => $value) {
					$q .= ($q ? $clue : '') . '`' . db_get_field($field) . "` = '" . addslashes($value) . "'";
				}
				$pattern = db_str_replace($ph, $q, $pattern, $offset);

			} elseif ($ph == '?e') { // insert
				$pattern = db_str_replace($ph, '(`' . implode('`, `', array_map('addslashes', array_keys($data[$k]))) . "`) VALUES ('" . implode("', '", array_map('addslashes', array_values($data[$k]))) . "')", $pattern, $offset);

			} elseif ($ph == '?f') { // field/table/database name
				$pattern = db_str_replace($ph, db_get_field($data[$k]), $pattern, $offset);

			} elseif ($ph == '?p') { // prepared statement
				$pattern = db_str_replace($ph, $data[$k], $pattern, $offset);
			}
		}
	}

	return $pattern;
}

/**
 * Parse query and replace placeholders with data
 *
 * @param string $query unparsed query
 * @param mixed ... unlimited number of variables for placeholders
 * @return parsed query
 */
function db_quote()
{
	$args = func_get_args();
	$pattern = array_shift($args);

	return db_process($pattern, $args, false);
}

/**
 * Placeholder replace helper
 *
 * @param string $needle string to replace
 * @param string $replacement replacement
 * @param string $subject string to search for replace
 * @param int $offset offset to search from
 * @return string with replaced fragment
 */
function db_str_replace($needle, $replacement, $subject, &$offset)
{
	$pos = strpos($subject, $needle, $offset);
	$offset = $pos + strlen($replacement);
	return substr_replace($subject, $replacement, $pos, 2);
}

/**
 * Convert variable to int/longint type
 *
 * @param mixed $int variable to convert
 * @return mixed int/intval variable
 */
function db_intval($int)
{
	return $int + 0;
}

/**
 * Check if variable is valid database table name, table field or database name
 *
 * @param mixed $int variable to convert
 * @return mixed int/intval variable
 */
function db_get_field($field)
{
	if (preg_match("/([\w]+)/", $field, $m) && $m[0] == $field) {
		return $field;
	}

	return '';
}

/**
 * Get column names from table
 *
 * @param string $table_name table name
 * @param array $exclude optional array with fields to exclude from result
 * @param boolean $wrap_quote optional parameter, if true, the fields will be enclosed in quotation marks
 * @return array columns array
 */
 function get_table_fields($table_name, $exclude = array(), $wrap = false)
{
	$structure = db_array("SHOW COLUMNS FROM $table_name");
	if (is_array($structure)) {
		$fields = array();
		foreach ($structure as $k => $v) {
			if (!in_array($v['Field'], $exclude)) {
				if ($wrap) {
					$fields[] = '`' . $v['Field'] . '`';
				} else {
					$fields[] = $v['Field'];
				}
			}
		}
		return $fields;
	}
	return false;
}

/**
 * Check if passed data corresponds columns in table and remove unnecessary data
 *
 * @param array $data data for compare
 * @param array $table_name table name
 * @return mixed array with filtered data or false if fails
 */
function check_table_fields($data, $table_name)
{
	$_fields = get_table_fields($table_name);
	if (is_array($_fields)) {
		foreach ($data as $k => $v) {
			if (!in_array($k, $_fields)) {
				unset($data[$k]);
			}
		}
		if (func_num_args() > 2) {
			for ($i = 2; $i < func_num_args(); $i++) {
				unset($data[func_get_arg($i)]);
			}
		}
		return $data;
	}
	return false;
}

/**
 * Display database error
 *
 * @param resource $result result, returned by database server
 * @param string $query SQL query, passed to server
 * @return mixed false if no error, dies with error message otherwise
 */
function db_error($result, $query, $trace)
{
	if (!empty($result) OR driver_db_errno() == 0) {
		// it's ok
	} else {
        array_pop($trace);
        $trace = array_pop($trace);
        $err = driver_db_error();
        //driver_db_errno()
        $err = substr($err, 0, 17) == 'You have an error' ? 'You have an error '.substr($err,128, -9) : $err;
        $err .= '<br>'.$query;
        aa($err);
	}

	return false;
}

/**
 * Connect to database server and select database
 *
 * @param string $host database host
 * @param string $user database user
 * @param string $password database password
 * @param string $name database name
 * @return resource database connection identifier, false if error occured
 */
function db_initiate($host, $user, $password, $name) {
	global $db;
	$db = driver_db_connect($host, $user, $password);
	if (!empty($db))
		return driver_db_select($name) ? $db : false;
	return false;
}
// todo: add operator params
function db_format_conditions($conditions_array) {
	if (!is_array($conditions_array)) return 'WHERE '.$conditions_array;
	$conditions = array();
	$or_conds = array();
	foreach ($conditions_array as $k=>$v) { 
		if (strstr($v, '||')) { $values = explode('||', $v); foreach ($values as $v) $or_conds[] = "$k='$v'"; }
		else { $conditions[] = "$k='$v'"; }
	}
	$conditions = 'WHERE '.implode(' AND ', $conditions);
	if (!empty($or_conds)) $conditions.=' AND ('.implode(' OR ', $or_conds).')';
	return $conditions;
}			
function db_format_order($orders_array) {
	$orders = array();
	foreach ($orders_array as $k=>$v) { $orders[] = "$k ".strtoupper($v); }
	$orders = 'ORDER BY '.implode(', ', $orders);
	return $orders;
}
function db_get($params) {
	db_pre_params($params);
	$query = db_quote('SELECT ' . $params['select'] . ' FROM ' . $params['table'] . ' ' . $params['join'] . ' ' . $params['conditions'] . ' ' . $params['group'] . ' ' . $params['order'] . ' ' . $params['limit']);
	if (isset($params['debug'])) { aa('DB QUERY DEBUG:'); aa('- params:  '); aa($params); aa('- query: '); if(isset($params['debug_continue'])) aa($query); else aa($query, 1); }
	if (isset($params['count_only'])) {
		$data = db_field($query);
	}
	else if (isset($params['get_fields']))
		$data = db_fields($query);
	else if (isset($params['limit']) && $params['limit']==1)
		$data = db_row($query);
	else $data = db_array($query);
	if (isset($params['get_row']) && isset($data[0])) $data = $data[0];
	return $data;
}
function db_pre_params(&$params) {
	if (!isset($params['table'])) return false;
	if (isset($params['get_row'])) $params['limit'] = 1;
	if (isset($params['limit'])) 
		if (strstr(strtolower($params['limit']), 'limit')!==false) $params['limit'] = $params['limit']; 
		else $params['limit'] = 'LIMIT ' . $params['limit']; 
	else $params['limit'] = '';
	if (isset($params['conditions'])) $params['conditions'] = db_format_conditions($params['conditions']); else $params['conditions'] = '';
	if (isset($params['order'])) $params['order'] = db_format_order($params['order']); else $params['order'] = '';
	if (isset($params['select'])) { if (is_array($params['select'])) $params['select'] = implode(', ', $params['select']);} else $params['select'] = '*';
	if (isset($params['count_only'])) $params['select'] = "COUNT(".$params['select'].")"; // in case we want to count records, we need only 1 SELECTOR to count on!
	if (isset($params['join'])) $params['join'] = $params['join']; else $params['join'] = '';
	if (isset($params['group'])) $params['group'] = 'GROUP BY '.$params['group']; else $params['group'] = '';
}
function db_delete($params) {
	db_pre_params($params);
	$query = db_quote('DELETE FROM ' . $params['table'] . ' ' . $params['join'] . ' ' . $params['conditions'] . ' ' . $params['group'] . ' ' . $params['order'] . ' ' . $params['limit']);
	if (isset($params['debug'])) { aa('DB QUERY DEBUG:'); aa('- params:  '); aa($params); aa('- query: '); if(isset($params['debug_continue'])) aa($query); else aa($query, 1); }
	$data = db_query($query);
	return $data;
}
function db_limit_records($table, $field_key, $limit, $params = array()) { // limit the existent records number (erasing extra/older records)
	$params['table'] = $table;
	$params['get_row'] = true;
	$params['count_only'] = true; 
	$count = db_get($params);
	if ($count > $limit) {
		$erase_number = ($count - $limit) + floor($count*20/100); // erase all extra records + x% of limit records
		$start_offset = $count - $erase_number;
		$end_offset = $erase_number;
		unset($params['get_row']);
		unset($params['count_only']);
		unset($params['limit']);
		$params['limit'] = 'LIMIT '.$end_offset.' OFFSET '.$start_offset;
		$params['order']['date'] = 'DESC';
		$params['get_fields'] = true;
		$params['select'] = $field_key;
		
		//$params['debug'] = true;
		$event_ids = db_get($params);
		db_query('DELETE FROM '.$table.' WHERE '.$field_key.' IN (?a)', $event_ids);
		return true;
	}
	return false;
}
?>